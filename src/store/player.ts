/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { useProgressStore } from "./progress"

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
  showVolumeListener: (el: HTMLDivElement) => void
  volumeEl: HTMLDivElement
  isPlaying: boolean
  showControls: boolean
  setShowControls: (show: boolean) => void
  isPaused: boolean
  isLoading: boolean
  volume: number
  playbackSpeed: number
  setPlaybackSpeed: (rate: number) => void
  pause: () => void
  play: () => void
  togglePlay: () => void
  skipForwardSeconds: (seconds: number) => void
  skipBackwardSeconds: (seconds: number) => void
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
  seek: (val: number) => void
  volumeChange: (percent: number) => void
  showVolume: boolean
}

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  playerEl: null as any,
  videoEl: null as any,
  isPlaying: false,
  showControls: true,
  isPaused: false,
  isLoading: false,
  volume: 1,
  playbackSpeed: 1,
  qualities: [],
  currentQuality: "",
  progress: 0,
  currentSubtitle: "",
  subtitles: [],
  showVolume: false,
  setShowControls: (show: boolean) => {
    set((_) => ({ showControls: show }))
  },
  volumeEl: null as any,
  showVolumeListener: (root: HTMLDivElement) => {
    let timer: any

    set((_) => ({
      volumeEl: root,
    }))

    root.addEventListener("mouseenter", () => {
      clearTimeout(timer)
      set((_) => ({ showVolume: true }))
    })
    root.addEventListener("mouseleave", () => {
      timer = setTimeout(() => {
        set((_) => ({ showVolume: false }))
      }, 500)
    })
  },
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
  skipForwardSeconds: (seconds: number) => {
    if (get().videoEl) {
      const current = get().videoEl.currentTime

      if (current + seconds >= get().videoEl.duration) {
        get().videoEl.currentTime = get().videoEl.duration
        set((_) => ({ progress: get().videoEl.duration }))
        return
      }

      get().videoEl.currentTime += seconds
      set((_) => ({ progress: current + seconds }))
    }
  },
  skipBackwardSeconds: (seconds: number) => {
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
  setPlaybackSpeed: (rate: number) => {
    if (get().videoEl) {
      get().videoEl.playbackRate = rate
      set((_) => ({ playbackSpeed: rate }))
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
    set((_) => ({
      playerEl: root,
    }))
  },
  addVideoEventListeners: (videoEl) => {
    set((_) => ({
      videoEl,
    }))

    useProgressStore.getState().addProgressEventListeners(videoEl)

    videoEl.addEventListener("play", () => {
      set((_) => ({ isPlaying: true, isPaused: false }))
    })
    videoEl.addEventListener("pause", () => {
      set((_) => ({ isPlaying: false, isPaused: true, showControls: true }))
    })
    videoEl.addEventListener("ended", () => {
      set((_) => ({ isPlaying: false, isPaused: true, showControls: true }))
    })

    videoEl.addEventListener("pause", () => {
      set((_) => ({ isPaused: true }))
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
      set((_) => ({ playbackSpeed: videoEl.playbackRate }))
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
  volumeChange(percent: number) {
    if (!get().videoEl) return
    get().volume = percent
    get().videoEl.volume = percent / 100
  },
  play() {
    get().videoEl.play()
    set((_) => ({ isPlaying: true, isPaused: false }))
  },
  pause() {
    get().videoEl.pause()
    set((_) => ({ isPlaying: false, isPaused: true }))
  },
  seek(val: number) {
    const time = Math.min(
      useProgressStore.getState().progress.duration,
      Math.max(0, val)
    )
    get().videoEl.currentTime = time
    useProgressStore.setState((state) => {
      state.progress.draggingTime = -1
      state.progress.time = time
      return state
    })
  },
}))
