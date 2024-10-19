import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function parseNumberFromString(str: string) {
  return Number(str.replace(/[^0-9]/g, ""))
}

export const isValidUrl = (url: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ) // fragment locator

  return !!pattern.test(url)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
