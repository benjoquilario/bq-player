import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

type ProgressStore = {
  addProgressEventListeners: (el: HTMLVideoElement) => void
  progress: {
    time: number
    duration: number
    buffered: { start: number; end: number }[]
    draggingTime: number
  }
  setDraggingTime(time: number): void
}

export const useProgressStore = create<ProgressStore>()(
  immer<ProgressStore>((set, _) => ({
    setDraggingTime(time: number) {
      set((state) => {
        state.progress.draggingTime = time
      })
    },
    progress: {
      time: 0,
      duration: 0,
      buffered: [],
      draggingTime: -1,
    },
    addProgressEventListeners(el: HTMLVideoElement) {
      el.addEventListener("durationchange", () => {
        set((state) => {
          state.progress.duration = el.duration
        })
      })
      el.addEventListener("timeupdate", () => {
        set((state) => {
          state.progress.time = el.currentTime
        })
      })
      el.addEventListener("progress", () => {
        set((state) => {
          state.progress.buffered = []
          for (let i = 0; i < el.buffered.length; i++) {
            state.progress.buffered.push({
              start: el.buffered.start(i),
              end: el.buffered.end(i),
            })
          }
        })
      })
    },
  }))
)
