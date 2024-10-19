/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"

export type Subtitle = {
  file: string
  lang: string
  language: string
}

type PlayerStore = {
  isFullScreen: boolean
  toggleFullScreen: () => void
  playerEl: HTMLDivElement
  videoEl: HTMLVideoElement
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
  playerEl: null as any,
  videoEl: null as any,
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
    if (get().videoEl) {
      set((_) => ({ subtitles }))
    }
  },
  setCurrentSubtitle: (subtitle: string) => {
    if (get().videoEl) {
      set((_) => ({ currentSubtitle: subtitle }))
    }
  },
  nextSeconds: (seconds: number) => {
    if (get().videoEl) {
      const current = get().videoEl.currentTime
      const total = get().videoEl.duration

      if (current + seconds >= total - 2) {
        get().videoEl.currentTime = total - 1

        set((_) => ({ progress: total - 1 }))
        return
      }
    }
  },
  previousSeconds: (seconds: number) => {
    if (get().videoEl) {
      const current = get().videoEl.currentTime

      if (current - seconds <= 0) {
        get().videoEl.currentTime = 0
        set((_) => ({ progress: 0 }))
        return
      }

      get().videoEl.currentTime -= seconds
      set((_) => ({ progress: current - seconds }))
    }
  },
  setPlaybackRate: (rate: number) => {
    if (get().videoEl) {
      get().videoEl.playbackRate = rate
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
      playerEl: root,
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
  addVideoEventListeners: (videoEl) => {
    set((_) => ({
      videoEl,
    }))

    videoEl.addEventListener("play", () => {
      set((_) => ({ isPlaying: true, isPaused: false }))
    })
    videoEl.addEventListener("pause", () => {
      set((_) => ({ isPlaying: false, isPaused: false, showControls: true }))
    })
    videoEl.addEventListener("ended", () => {
      set((_) => ({ isPlaying: false, isPaused: false, showControls: true }))
    })
    videoEl.addEventListener("click", () => {
      if (get().isPlaying) {
        videoEl.pause()
        get().videoEl.pause()
        set((_) => ({ isPaused: true }))
      } else {
        videoEl.play()
        set((_) => ({ isPaused: false }))
      }
    })
    videoEl.addEventListener("pause", () => {
      set((_) => ({ isPaused: true }))
    })
    videoEl.addEventListener("playing", () => {
      set((_) => ({ isLoading: false, isPlaying: true }))
    })
    videoEl.addEventListener("waiting", () => {
      set((_) => ({ isLoading: true }))
    })

    videoEl.addEventListener("loadedmetadata", () => {
      set((_) => ({ isLoading: false }))
    })
    videoEl.addEventListener("volumechange", () => {
      set((_) => ({ volume: videoEl.volume }))
    })

    videoEl.addEventListener("ratechange", () => {
      set((_) => ({ playbackRate: videoEl.playbackRate }))
    })

    videoEl.addEventListener("fullscreenchange", () => {
      set((_) => ({ isFullScreen: !!document.fullscreenElement }))
    })
  },
  goToPosition: (position: number) => {
    if (get().videoEl) {
      get().videoEl.currentTime = position
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
    const promise = get().videoEl.play()

    if (promise) {
      promise.catch()
    }
    set((_) => ({ isPlaying: true }))
  },
  pause() {
    get().videoEl.pause()
    set((_) => ({ isPlaying: false }))
  },
}))
