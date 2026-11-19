import { expect, test } from "bun:test"
import { createProcsyTransport, gradeOn20, GradeKind, nearbySchools, studentPortal } from "../dist/index.js"

test("relays approved mobile PRONOTE requests through Procsy", async () => {
  const saved = globalThis.fetch
  let count = 0
  globalThis.fetch = (async (url: URL, init: RequestInit) => {
    count++
    expect(url.href).toBe("https://proxy.api.scolup.com/pronote/mobile.eleve.html?fd=1")
    const headers = new Headers(init.headers)
    expect(headers.get("X-Procsy-Base-URL")).toBe("0721281b.index-education.net")
    expect(headers.get("X-Procsy-Cookie")).toBe("appliMobile=1")
    expect(headers.has("cookie")).toBe(false)
    expect(init.credentials).toBe("omit")
    expect(init.redirect).toBe("error")
    return new Response("PRONOTE")
  }) as typeof fetch
  const send = createProcsyTransport()
  try {
    const url = new URL("https://0721281b.index-education.net/pronote/mobile.eleve.html?fd=1")
    expect((await send({ url, headers: { Cookie: "appliMobile=1; other=ignored" } })).content).toBe("PRONOTE")
    await expect(send({ url: new URL("https://invalid.example/pronote/mobile.eleve.html") })).rejects.toThrow()
    expect(count).toBe(1)
  } finally {
    globalThis.fetch = saved
  }
})

test("finds hosted student portals and rejects foreign domains", async () => {
  const schools = await nearbySchools({ latitude: 47.91, longitude: 0.25 }, async () => ({
    status: 200, headers: {}, content: JSON.stringify([
      { url: "https://0721281B.index-education.net/pronote", nomEtab: "COLLEGE BOLLEE", lat: 47.9, long: 0.23, cp: 72230 },
      { url: "https://invalid.example/pronote", nomEtab: "Ignore", lat: 47.91, long: 0.25 },
    ]),
  }))
  expect(schools).toHaveLength(1)
  expect(schools[0].url).toBe(studentPortal("https://0721281b.index-education.net/pronote"))
})

test("scales a class average and retains zero", () => {
  expect(gradeOn20({ kind: GradeKind.Grade, points: 7.5 }, 10)).toBe(15)
  expect(gradeOn20({ kind: GradeKind.Grade, points: 0 })).toBe(0)
  expect(gradeOn20({ kind: GradeKind.NotGraded, points: 0 })).toBeUndefined()
})
