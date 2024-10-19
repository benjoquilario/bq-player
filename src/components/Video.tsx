import { useEffect, useRef } from "react"
import { usePlayerStore } from "@/store/player"
import Hls, { HlsConfig } from "hls.js"
import { parseNumberFromString } from "@/utils/utils"
import { cn } from "@/utils/utils"

export type VideoProps = {
  children?: React.ReactNode
  hlsConfig?: HlsConfig
  className?: string
  hlsVersion?: string
  preferQuality?: (qualities: string[]) => string
  changeSourceUrl?: (currentSourceUrl: string, source: string) => string
} & React.VideoHTMLAttributes<HTMLVideoElement>

const Video = (props: VideoProps) => {
  const {
    src,
    children,
    hlsConfig,
    autoPlay,
    className,
    preferQuality,
    changeSourceUrl,
  } = props
  const videoRef = useRef<HTMLVideoElement>(null)
  const hls = useRef<Hls | null>(null)
  const {
    addVideoEventListeners,
    currentQuality,
    setCurrentQuality,
    setQualities,
    setSubtitles,
    setCurrentSubtitle,
  } = usePlayerStore()

  useEffect(() => {
    if (!videoRef.current) return

    addVideoEventListeners(videoRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function _initPlayer() {
      if (hls.current) {
        hls.current.destroy()
      }

      const _hls = new Hls({
        xhrSetup: (xhr, url) => {
          const requestUrl = changeSourceUrl?.(url, src!) || url

          xhr.open("GET", requestUrl, true)
        },
        enableWorker: false,
        ...hlsConfig,
      })

      _hls.subtitleTrack = -1
      _hls.subtitleDisplay = false

      hls.current = _hls

      if (videoRef.current != null) {
        _hls.attachMedia(videoRef.current)
      }

      _hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        _hls.loadSource(src!)

        _hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            videoRef?.current
              ?.play()
              .catch(() =>
                console.log(
                  "Unable to autoplay prior to user interaction with the dom."
                )
              )
          }

          if (!src) return
          if (!_hls.levels?.length) return

          const levels: string[] = _hls.levels
            .sort((a, b) => b.height - a.height)
            .filter((level) => level.height)
            .map((level) => `${level.height}p`)

          const level = preferQuality?.(levels) || levels[0]
          const levelIndex = _hls.levels.findIndex(
            (hlsLevel) => hlsLevel.height === parseNumberFromString(level)
          )

          _hls.currentLevel = levelIndex

          setCurrentQuality(level)
          setQualities(levels)
        })

        _hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, event) => {
          const modifiedSubtitles = event.subtitleTracks.map(
            (track, index) => ({
              file: track.details?.fragments?.[0].url || track.url,
              lang: track.lang || index.toString(),
              language: track.name,
            })
          )

          setSubtitles(modifiedSubtitles)
          setCurrentSubtitle(modifiedSubtitles[0]?.lang)
        })
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _hls.on(Hls.Events.ERROR, function (_, data: any) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              _hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              _hls.recoverMediaError()
              break
            default:
              _initPlayer()
              _hls.destroy()

              break
          }
        }
      })

      hls.current = _hls
    }

    // Check for Media Source support
    if (Hls.isSupported()) {
      _initPlayer()
    } else {
      if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = src!
      }
    }

    return () => {
      if (hls.current) {
        hls.current.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, hlsConfig])

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      preload="auto"
      // className={styles.video}
      playsInline
      crossOrigin="anonymous"
      {...props}
      className={cn("absolute inset-0 h-full w-full bg-black", className)}
    >
      {children}
    </video>
  )
}
export default Video
