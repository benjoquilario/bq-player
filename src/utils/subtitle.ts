import { isValidUrl } from "./utils"
import { buildAbsoluteURL } from "url-toolkit"

const M3U8_SUBTITLE_REGEX = /.*\.(vtt|srt)/g

export const requestSubtitle = async (url: string): Promise<string | null> => {
  if (url.includes("vtt") || url.includes("srt")) {
    const response = await fetch(url)
    const text = await response.text()

    return text
  }

  if (url.includes("m3u8")) {
    const response = await fetch(url)
    const text = await response.text()

    const matches = text.match(M3U8_SUBTITLE_REGEX)

    if (!matches?.length) return null

    if (!matches[0]) return null

    const nextUrl = isValidUrl(matches[0])
      ? matches[0]
      : buildAbsoluteURL(url, matches[0])

    return requestSubtitle(nextUrl)
  }

  return null
}
