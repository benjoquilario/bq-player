import { create } from "zustand"

type SliderStore = {
  sliderEl: HTMLDivElement
  addSliderEventListeners: (el: HTMLDivElement) => void
}

export const useSliderStore = create<SliderStore>((set, get) => ({
  sliderEl: null as any,
  addSliderEventListeners: (el: HTMLDivElement) => {
    set((_) => ({ sliderEl: el }))
  },
}))
