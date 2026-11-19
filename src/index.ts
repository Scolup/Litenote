import {
  AccountKind, assignmentStatus, assignmentsFromIntervals, createSessionHandle,
  discussionMessages, discussions, DiscussionFolderKind, GradeKind, gradesOverview,
  instance, loginQrCode, loginToken, notebook, parseTimetable, resource,
  SessionExpiredError, TabLocation, timetableFromIntervals,
  type Discussion, type GradeValue, type RefreshInformation, type SessionHandle,
} from "pawnote"
import { pronoteUrl, studentPortal } from "./host.js"

export { DiscussionFolderKind, GradeKind, SessionExpiredError, studentPortal }
type Fetcher = NonNullable<Parameters<typeof createSessionHandle>[0]>
export type Position = { latitude: number; longitude: number }
export type School = Position & { url: string; name: string; postalCode: string }
export type Credentials = RefreshInformation & { deviceUUID: string }

export function createProcsyTransport(base = "https://proxy.api.scolup.com"): Fetcher {
  return async (request) => {
    const directory = request.url.href === "https://www.index-education.com/swie/geoloc.php"
    const target = directory ? request.url : pronoteUrl(request.url.href)
    if (!directory && !/^\/(?:pronote\/)?(?:infomobileapp\.json|mobile\.eleve\.html|appelfonction\/6\/\d+\/[a-f\d]+)$/i.test(target.pathname)) {
      throw new Error("Cette route PRONOTE n’est pas prise en charge.")
    }
    const source = new Headers(request.headers)
    const headers = new Headers({ "X-Procsy-Base-URL": target.hostname })
    const type = source.get("content-type")
    if (type) headers.set("Content-Type", type)
    const agent = source.get("user-agent")
    if (agent) headers.set("X-Procsy-User-Agent", agent)
    if (source.get("cookie")?.includes("appliMobile=1")) headers.set("X-Procsy-Cookie", "appliMobile=1")
    const url = new URL(target.pathname + target.search, base)
    const response = await fetch(url, {
      method: request.method ?? "GET",
      body: request.content,
      headers,
      redirect: "error",
      credentials: "omit",
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    })
    if (!response.ok) throw new Error("Le service PRONOTE est indisponible.")
    return { status: response.status, content: await response.text(), headers: response.headers }
  }
}
export const browserTransport = createProcsyTransport()

// The directory protocol follows BlocksHub/Blocksnote, routes/geolocation.ts.
export async function nearbySchools(point: Position, transport = browserTransport): Promise<School[]> {
  const response = await transport({
    url: new URL("https://www.index-education.com/swie/geoloc.php"),
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    content: new URLSearchParams({
      data: JSON.stringify({ nomFonction: "geoLoc", lat: point.latitude, long: point.longitude }),
    }).toString(),
  })
  const entries: unknown = JSON.parse(response.content)
  if (!Array.isArray(entries)) return []
  const schools: School[] = []
  for (const entry of entries) {
    if (!entry || typeof entry.url !== "string" || typeof entry.nomEtab !== "string") continue
    const latitude = Number(entry.lat)
    const longitude = Number(entry.long)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue
    try {
      schools.push({ url: studentPortal(entry.url), name: entry.nomEtab, latitude, longitude, postalCode: String(entry.cp ?? "") })
    } catch {
      // The directory also includes instances outside supported hosted domains.
    }
  }
  const scale = Math.cos(point.latitude * Math.PI / 180)
  const distance = (school: School) => Math.hypot(school.latitude - point.latitude, (school.longitude - point.longitude) * scale)
  return schools.sort((a, b) => distance(a) - distance(b))
}

export function gradeOn20(value: GradeValue | undefined, outOf = 20): number | undefined {
  return value?.kind === GradeKind.Grade && Number.isFinite(value.points) &&
    Number.isFinite(outOf) && outOf > 0 ? value.points * 20 / outOf : undefined
}

export class Litenote {
  private session: SessionHandle | undefined
  private transport: Fetcher
  private pendingGrades?: ReturnType<Litenote["readGrades"]>

  constructor(transport: Fetcher = browserTransport) {
    this.transport = transport
  }

  portal(url: string) {
    return instance(pronoteUrl(url).href, this.transport)
  }

  async connectQr(payload: string, pin: string, expectedPortal: string): Promise<Credentials> {
    const qr = JSON.parse(payload) as { url?: unknown; jeton?: unknown; login?: unknown } | null
    if (!qr || typeof qr.url !== "string" || typeof qr.jeton !== "string" ||
      typeof qr.login !== "string" || !/^\d{4}$/.test(pin) ||
      !/\/(?:mobile\.)?eleve\.html$/i.test(pronoteUrl(qr.url).pathname) ||
      studentPortal(qr.url) !== studentPortal(expectedPortal)
    ) throw new Error("Utilise le QR de l’espace élève de l’établissement choisi et le code à quatre chiffres.")
    const deviceUUID = crypto.randomUUID()
    const session = createSessionHandle(this.transport)
    const refresh = await loginQrCode(session, {
      qr: { url: studentPortal(qr.url), jeton: qr.jeton, login: qr.login },
      pin,
      deviceUUID,
    })
    this.pendingGrades = undefined
    this.session = session
    return { ...refresh, deviceUUID }
  }

  async restore(credentials: Credentials): Promise<Credentials> {
    pronoteUrl(credentials.url)
    const session = createSessionHandle(this.transport)
    const refresh = await loginToken(session, { ...credentials, kind: AccountKind.STUDENT })
    this.pendingGrades = undefined
    this.session = session
    return { ...refresh, deviceUUID: credentials.deviceUUID }
  }

  get profile() { return this.session?.userResource }

  logout() {
    this.session = undefined
    this.pendingGrades = undefined
  }

  private get active() {
    if (!this.session) throw new Error("Reconnecte-toi à PRONOTE.")
    return this.session
  }

  grades() {
    if (this.pendingGrades) return this.pendingGrades
    const reports = this.readGrades(this.active).finally(() => {
      if (this.pendingGrades === reports) this.pendingGrades = undefined
    })
    this.pendingGrades = reports
    return reports
  }

  private async readGrades(session: SessionHandle) {
    const tab = session.userResource.tabs.get(TabLocation.Grades)
    const periods = tab?.periods.length ? tab.periods : tab?.defaultPeriod ? [tab.defaultPeriod] : []
    const reports = await Promise.all(periods.map(async (period) => ({
      period, overview: await gradesOverview(session, period),
    })))
    return { reports, defaultPeriod: tab?.defaultPeriod?.id }
  }

  async timetable(from: Date, to: Date) {
    const session = this.active
    const result = await timetableFromIntervals(session, from, to)
    parseTimetable(session, result, { withSuperposedCanceledClasses: false, withCanceledClasses: true, withPlannedClasses: true })
    return result.classes
  }

  homework(from: Date, to: Date) { return assignmentsFromIntervals(this.active, from, to) }
  markHomework(id: string, done: boolean) { return assignmentStatus(this.active, id, done) }
  lesson(id: string) { return resource(this.active, id) }

  async messages() {
    const session = this.active
    return session.userResource.tabs.has(TabLocation.Discussions) ? (await discussions(session)).items : []
  }

  message(discussion: Discussion) { return discussionMessages(this.active, discussion, true) }

  async attendance() {
    const session = this.active
    const period = session.userResource.tabs.get(TabLocation.Notebook)?.defaultPeriod
    return period ? notebook(session, period) : null
  }
}

