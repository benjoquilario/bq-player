import React, { useEffect, useRef, useCallback } from "react"
import { usePlayerStore } from "@/store/player"
import Hls, { HlsConfig } from "hls.js"
import { parseNumberFromString } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { type Source } from "@/types"
import { shouldPlayHls } from "@/lib/hls"

export type VideoProps = {
  children?: React.ReactNode
  hlsConfig?: HlsConfig
  className?: string
  hlsVersion?: string
  sources: Source[]
  preferQuality?: (qualities: string[]) => string
  changeSourceUrl?: (currentSourceUrl: string, source: Source) => string
} & React.VideoHTMLAttributes<HTMLVideoElement>

const Video = React.forwardRef<HTMLVideoElement, VideoProps>((props, ref) => {
  const {
    children,
    hlsConfig,
    autoPlay,
    className,
    preferQuality,
    changeSourceUrl,
  } = props
  const videoRef = useRef<HTMLVideoElement>()
  const hls = useRef<Hls | null>(null)
  const {
    addVideoEventListeners,
    setCurrentQuality,
    setQualities,
    setSubtitles,
    setCurrentSubtitle,
    currentQuality,
  } = usePlayerStore()

  useEffect(() => {
    if (!videoRef.current) return

    addVideoEventListeners(videoRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playerRef = useCallback(
    (node: any) => {
      videoRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLVideoElement>).current = node
      }
    },
    [ref]
  )

  const _initPlayer = useCallback(
    async (source: Source) => {
      {
        if (hls.current) {
          hls.current.destroy()
        }

        const _hls = new Hls({
          xhrSetup: (xhr, url) => {
            const requestUrl = changeSourceUrl?.(url, source) || url

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
          _hls.loadSource(source.file!)

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

            if (props.sources.length > 1) return
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
                _initPlayer(source)
                _hls.destroy()

                break
            }
          }
        })

        hls.current = _hls
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.sources]
  )

  useEffect(() => {
    const source =
      props.sources.find((source) => source.label === currentQuality) ||
      props.sources[0]

    // Check for Media Source support
    if (Hls.isSupported()) {
      _initPlayer(source)
    } else {
      if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = source.file
      }
    }

    return () => {
      if (hls.current) {
        hls.current.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sources, hlsConfig])

  useEffect(() => {
    const source =
      props.sources.find((source) => source.label === currentQuality) ||
      props.sources[0]

    if (!videoRef.current) return

    if (shouldPlayHls(source) && props.sources.length === 1) {
      // Check if the playlist gave us qualities.
      if (!hls?.current?.levels?.length) return
      if (!currentQuality) return

      // Handle changing quality.
      const index = hls.current.levels.findIndex(
        (level) => level.height === parseNumberFromString(currentQuality!)
      )

      if (index === -1) return

      hls.current.currentLevel = index

      return
    }

    const beforeChangeTime = videoRef?.current.currentTime

    const qualitySource = props.sources.find(
      (source) => source.label === currentQuality
    )

    if (!qualitySource) return

    _initPlayer(qualitySource)

    const handleQualityChange = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = beforeChangeTime
      }
      videoRef?.current?.play()
    }

    videoRef.current.addEventListener("canplay", handleQualityChange, {
      once: true,
    })

    return () => {
      videoRef.current?.removeEventListener("canplay", handleQualityChange)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuality])

  return (
    <video
      ref={playerRef}
      autoPlay={autoPlay}
      preload="auto"
      // className={styles.video}
      playsInline
      crossOrigin="anonymous"
      {...props}
      className={cn("absolute inset-0 h-full w-full object-contain", className)}
    >
      {children}
    </video>
  )
})

export default Video
