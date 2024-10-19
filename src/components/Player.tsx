import React, { useRef, useState, useEffect, useMemo } from "react"
import Video, { type VideoProps } from "./Video"
import { usePlayerStore } from "@/store/player"
import Subtitle from "./Subtitle"
import { type Subtitle as ISubtitle } from "@/store/player"
import { type Source } from "@/types"

type PlayerProps = {
  sources: Source[]
  subtitles?: ISubtitle[]
} & VideoProps

const Player = React.forwardRef<HTMLVideoElement, PlayerProps>((props, ref) => {
  const divEl = useRef<HTMLDivElement>(null)
  const {
    addPlayerEventListeners,
    setCurrentQuality,
    setCurrentSubtitle,
    setQualities,
    setSubtitles,
    currentQuality,
  } = usePlayerStore()
  const [src, setSrc] = useState("")

  const defaultQualities = useMemo(
    () =>
      props.sources
        .filter((source) => source.label)
        .map((source) => source.label!),
    [props.sources]
  )

  const defaultState = useMemo(
    () => ({
      currentSubtitle: props.subtitles?.[0]?.lang,
      subtitles: props.subtitles,
      qualities: defaultQualities,
    }),
    [props.subtitles, defaultQualities]
  )

  useEffect(() => {
    if (!divEl.current) return

    addPlayerEventListeners(divEl.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Initialize src.

    setSrc(props.sources[0].file)
  }, [])

  useEffect(() => {
    if (!divEl.current) return

    setQualities(defaultState.qualities)
    setSubtitles(defaultState.subtitles!)
    setCurrentSubtitle(defaultState.currentSubtitle!)
    setCurrentQuality(currentQuality || defaultState.qualities[0])
  }, [])

  function changeSource(type: string) {
    switch (type) {
      case "audio":
        setSrc(
          "https://www088.anzeat.pro/streamhls/0b594d900f47daabc194844092384914/ep.1.1703914189.m3u8"
        )
        break
      case "video":
        setSrc(
          "https://www114.anzeat.pro/streamhls/0b594d900f47daabc194844092384914/ep.2.1709232111.m3u8"
        )
        break
      case "hls":
        setSrc("https://files.vidstack.io/sprite-fight/hls/stream.m3u8")
        break
      case "youtube":
        setSrc("youtube/_cMxraX_5RE")
        break
      case "vimeo":
        setSrc("vimeo/640499893")
        break
    }
  }

  return (
    <>
      <div
        className="relative h-screen overflow-hidden"
        ref={divEl}
        style={{ position: "relative", overflow: "hidden" }}
      >
        <Video ref={ref} {...props} src={src} playsInline autoPlay={true} />

        <Subtitle />
      </div>
      <div>
        <button onClick={() => changeSource("audio")}>Ep 1</button>
        <button onClick={() => changeSource("video")}>Ep 2</button>
      </div>
    </>
  )
})

export default Player
