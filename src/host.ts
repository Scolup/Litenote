export function pronoteUrl(value: string): URL {
  const url = new URL(value)
  if (
    url.protocol !== "https:" ||
    url.port ||
    url.username ||
    url.password ||
    !/^[a-z0-9-]+\.index-education\.(net|com)$/.test(url.hostname)
  ) {
    throw new Error("Cette adresse PRONOTE hébergée n’est pas prise en charge.")
  }
  return url
}

export function studentPortal(value: string): string {
  const url = pronoteUrl(value)
  url.pathname = url.pathname.replace(/(?:\/[^/]+\.html)?\/?$/i, "/eleve.html")
  url.search = ""
  url.hash = ""
  return url.href
}
