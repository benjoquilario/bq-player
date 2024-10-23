import React, { useRef, useEffect, useMemo } from "react"
import Video, { type VideoProps } from "./Video"
import { usePlayerStore } from "@/store/player"
import Subtitle from "./Subtitle"
import { type Subtitle as ISubtitle } from "@/store/player"
import TimeSlider from "./Slider"
import { Controller } from "./Controller"
import Time from "./Time"
import PlayPauseButton from "./button/PlayPauseButton"
import SkipButton from "./button/SkipButton"
import Volume from "./Volume"

type PlayerProps = {
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
    if (!divEl.current) return

    setQualities(defaultState.qualities)
    setSubtitles(defaultState.subtitles!)
    setCurrentSubtitle(defaultState.currentSubtitle!)
    setCurrentQuality(currentQuality || defaultState.qualities[0])
  }, [])

  return (
    <>
      <div
        className="relative h-screen overflow-hidden bg-black"
        ref={divEl}
        style={{ position: "relative", overflow: "hidden" }}
      >
        <Video ref={ref} {...props} />

        <Subtitle />
        <Controller>
          <TimeSlider />
          <div className="flex w-full items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <PlayPauseButton />
              <SkipButton />
              <Volume />
              <Time />
            </div>
            <div className="flex items-center">
              <button>Qualities</button>
              <button>Subtitles</button>
            </div>
          </div>
        </Controller>
      </div>
      {/* <div>
        <button onClick={() => changeSource("audio")}>Ep 1</button>
        <button onClick={() => changeSource("video")}>Ep 2</button>
      </div> */}
    </>
  )
})

export default Player
