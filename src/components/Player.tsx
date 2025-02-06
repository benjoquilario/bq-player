import React, { useRef } from "react"
import Video, { type VideoProps } from "./Video"
import { usePlayerStore } from "@/store/player"
import Subtitle from "./Subtitle"
import { type Subtitle as ISubtitle } from "@/store/player"
import TimeSlider from "./Slider"
import { Controller } from "./Controller"
import Time from "./Time"
import PlayPauseButton from "./button/PlayPauseButton"
// import SkipButton from "./button/SkipButton"
import Volume from "./Volume"
import FullScreen from "./button/FullScreen"
import CaptionButton from "./button/Caption"
import SettingsMenu from "./button/Settings"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"
import { isMobile } from "@/lib/utils"

export type PlayerProps = {
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
    isPlaying,
    showControls,
    setShowControls,
    togglePlay,
    isFullScreen,
  } = usePlayerStore()
  const timeOutRef = useRef<number | null>(null)

  const handleOverState = () => {
    if (!divEl.current) return

    timeOutRef.current && clearTimeout(timeOutRef.current)

    setShowControls(true)

    timeOutRef.current = window.setTimeout(() => {
      setShowControls(false)
    }, 1500)
  }

  const defaultQualities = React.useMemo(
    () =>
      props.sources
        .filter((source) => source.label)
        .map((source) => source.label!),
    [props.sources]
  )

  const defaultState = React.useMemo(
    () => ({
      currentSubtitle: props.subtitles?.[0]?.lang,
      subtitles: props.subtitles,
      qualities: defaultQualities,
    }),
    [props.subtitles, defaultQualities]
  )

  React.useEffect(() => {
    if (!divEl.current) return

    addPlayerEventListeners(divEl.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!divEl.current) return

    setQualities(defaultState.qualities)
    setSubtitles(defaultState.subtitles!)
    setCurrentSubtitle(defaultState.currentSubtitle!)
    setCurrentQuality(currentQuality || defaultState.qualities[0])
  }, [])

  const handleShowControls = () => {
    setShowControls(true)
  }

  React.useEffect(() => {
    if (!divEl.current) return

    try {
      if (isFullScreen) {
        if (isMobile()) {
          let elem = divEl.current as any
          const requestFullScreen =
            elem.requestFullscreen ||
            elem.webkitRequestFullscreen ||
            elem.webkitRequestFullScreen ||
            elem.webkitEnterFullscreen ||
            elem.mozRequestFullScreen ||
            elem.msRequestFullscreen
          requestFullScreen?.call(elem).catch((err: any) => console.log(err))
        } else {
          let elem = divEl.current as any
          const requestFullScreen =
            elem.requestFullscreen ||
            elem.webkitRequestFullscreen ||
            elem.webkitRequestFullScreen ||
            elem.webkitEnterFullscreen ||
            elem.mozRequestFullScreen ||
            elem.msRequestFullscreen
          requestFullScreen?.call(elem).catch((err: any) => console.log(err))
        }
      } else {
        let doc = document as any

        const exitFullScreen =
          doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.webkitCancelFullScreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen

        exitFullScreen?.call(document).catch((err: any) => console.log(err))
      }
    } catch (error) {
      console.log(error)
    }
    handleOverState()
  }, [isFullScreen])

  return (
    <>
      <div
        className="relative h-screen overflow-hidden bg-black"
        ref={divEl}
        onTouchEnd={handleShowControls}
        onClick={handleShowControls}
        onMouseEnter={() =>
          timeOutRef.current && clearTimeout(timeOutRef.current)
        }
        onMouseMove={handleOverState}
        style={{ position: "relative", overflow: "hidden" }}
      >
        <Video ref={ref} {...props} />
        <div
          className={`z-100 absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <button
            // onClick={() => skip(-10)}
            className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlay}
            className="mx-4 rounded-full bg-black/50 p-4 text-white transition-colors hover:bg-black/70"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button
            // onClick={() => skip(10)}
            className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <SkipForward size={24} />
          </button>
        </div>
        <Subtitle />
        <Controller>
          <TimeSlider />
          <div className="flex w-full items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2">
              <PlayPauseButton />
              {/* <SkipButton /> */}
              <Volume />
              <Time />
            </div>
            <div className="flex items-center space-x-3">
              {/* <button>Qualities</button> */}

              <CaptionButton />
              <SettingsMenu />
              <FullScreen />
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
