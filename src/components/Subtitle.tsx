// credits to: https://github.com/hoangvu12/netplayer/blob/main/src/components/Subtitle/Subtitle.tsx

import { useMemo, useState, useEffect } from "react"
import { requestSubtitle } from "@/lib/subtitle"
import { usePlayerStore } from "@/store/player"
import { parse } from "@plussub/srt-vtt-parser"

const Subtitle = () => {
  const { subtitles, currentSubtitle, videoEl } = usePlayerStore()
  const [isLoading, setIsLoading] = useState(false)
  const [subtitleText, setSubtitleText] = useState("")
  const [currentText, setCurrentText] = useState("")

  const subtitle = useMemo(
    () => subtitles?.find((sub) => sub.lang === currentSubtitle),
    [subtitles, currentSubtitle]
  )

  useEffect(() => {
    if (!subtitle?.file) return

    const getSubtitle = async () => {
      setIsLoading(true)

      const text = await requestSubtitle(subtitle.file)
      setIsLoading(false)
      if (!text) return

      setSubtitleText(text)
    }

    getSubtitle()
  }, [subtitle])

  useEffect(() => {
    if (!subtitleText) return
    if (!videoEl) return

    const { entries = [] } = parse(subtitleText)

    const handleSubtitle = () => {
      const currentTime = videoEl.currentTime * 1000
      const currentEntry = entries.find(
        (entry) => entry.from <= currentTime && entry.to >= currentTime
      )

      setCurrentText(currentEntry?.text || "")
    }

    videoEl.addEventListener("timeupdate", handleSubtitle)

    return () => {
      videoEl.removeEventListener("timeupdate", handleSubtitle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitleText])

  if (isLoading || !subtitle?.file || !currentText) return null

  return (
    <div>
      <p
        dangerouslySetInnerHTML={{
          __html: currentText,
        }}
      ></p>
    </div>
  )
}
export default Subtitle
