/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"

type Subtitle = {
  file: string
  lang: string
  language: string
}

type PlayerStore = {
  isFullScreen: boolean
  toggleFullScreen: () => void
  player: HTMLDivElement
  video: HTMLVideoElement
  addPlayerEventListeners: (el: HTMLDivElement) => void
  addVideoEventListeners: (el: HTMLVideoElement) => void
  isPlaying: boolean
  showControls: boolean
  isPaused: boolean
  isLoading: boolean
  volume: number
  playbackRate: number
  setPlaybackRate: (rate: number) => void
  pause: () => void
  play: () => void
  nextSeconds: (seconds: number) => void
  previousSeconds: (seconds: number) => void
  qualities: string[]
  setQualities: (qualities: string[]) => void
  currentQuality: string | null
  setCurrentQuality: (quality: string) => void
  progress: number
  goToPosition: (position: number) => void
  subtitles: Subtitle[]
  currentSubtitle: string
  setSubtitles: (subtitles: Subtitle[]) => void
  setCurrentSubtitle: (subtitle: string) => void
}

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  player: null as any,
  video: null as any,
  isPlaying: false,
  showControls: false,
  isPaused: false,
  isLoading: false,
  volume: 1,
  playbackRate: 1,
  qualities: [],
  currentQuality: "",
  progress: 0,
  currentSubtitle: "",
  subtitles: [],
  setCurrentQuality: (quality: string) => {
    set((_) => ({ currentQuality: quality }))
  },
  setQualities: (qualities: string[]) => {
    set((_) => ({ qualities: qualities }))
  },
  setSubtitles: (subtitles: Subtitle[]) => {
    if (get().video) {
      set((_) => ({ subtitles }))
    }
  },
  setCurrentSubtitle: (subtitle: string) => {
    if (get().video) {
      set((_) => ({ currentSubtitle: subtitle }))
    }
  },
  nextSeconds: (seconds: number) => {
    if (get().video) {
      const current = get().video.currentTime
      const total = get().video.duration

      if (current + seconds >= total - 2) {
        get().video.currentTime = total - 1

        set((_) => ({ progress: total - 1 }))
        return
      }
    }
  },
  previousSeconds: (seconds: number) => {
    if (get().video) {
      const current = get().video.currentTime

      if (current - seconds <= 0) {
        get().video.currentTime = 0
        set((_) => ({ progress: 0 }))
        return
      }

      get().video.currentTime -= seconds
      set((_) => ({ progress: current - seconds }))
    }
  },
  setPlaybackRate: (rate: number) => {
    if (get().video) {
      get().video.playbackRate = rate
      set((_) => ({ playbackRate: rate }))
    }
  },
  toggleFullScreen: () => {
    if (get().isFullScreen) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }

    set((state) => ({ isFullScreen: !state.isFullScreen }))
  },
  isFullScreen: false,
  addPlayerEventListeners: (root) => {
    let timer: any

    set((_) => ({
      player: root,
    }))

    root.addEventListener("mouseenter", () => {
      if (!get().isPlaying) return

      clearTimeout(timer)
      set((_) => ({ showControls: true }))
    })
    root.addEventListener("mouseleave", () => {
      if (!get().isPlaying) return

      clearTimeout(timer)
      timer = setTimeout(() => {
        set((_) => ({ showControls: false }))
      }, 2500)
    })
  },
  addVideoEventListeners: (video) => {
    set((_) => ({
      video,
    }))

    video.addEventListener("play", () => {
      set((_) => ({ isPlaying: true, isPaused: false }))
    })
    video.addEventListener("pause", () => {
      set((_) => ({ isPlaying: false, isPaused: false, showControls: true }))
    })
    video.addEventListener("ended", () => {
      set((_) => ({ isPlaying: false, isPaused: false, showControls: true }))
    })
    video.addEventListener("click", () => {
      if (get().isPlaying) {
        video.pause()
        get().video.pause()
        set((_) => ({ isPaused: true }))
      } else {
        video.play()
        set((_) => ({ isPaused: false }))
      }
    })
    video.addEventListener("pause", () => {
      set((_) => ({ isPaused: true }))
    })
    video.addEventListener("playing", () => {
      set((_) => ({ isLoading: false, isPlaying: true }))
    })
    video.addEventListener("waiting", () => {
      set((_) => ({ isLoading: true }))
    })

    video.addEventListener("loadedmetadata", () => {
      set((_) => ({ isLoading: false }))
    })
    video.addEventListener("volumechange", () => {
      set((_) => ({ volume: video.volume }))
    })

    video.addEventListener("ratechange", () => {
      set((_) => ({ playbackRate: video.playbackRate }))
    })

    video.addEventListener("fullscreenchange", () => {
      set((_) => ({ isFullScreen: !!document.fullscreenElement }))
    })
  },
  goToPosition: (position: number) => {
    if (get().video) {
      get().video.currentTime = position
      set((_) => ({ progress: position }))
    }
  },
  togglePlay: () => {
    if (get().isPlaying) {
      get().pause()
    } else {
      get().play()
    }
  },
  play() {
    get().video.play()
    set((_) => ({ isPlaying: true }))
  },
  pause() {
    get().video.pause()
    set((_) => ({ isPlaying: false }))
  },
}))
