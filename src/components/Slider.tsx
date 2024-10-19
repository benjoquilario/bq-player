import { useSliderStore } from "@/store/slider"
import { useEffect, useRef } from "react"

const Slider = () => {
  const sliderRef = useRef<HTMLDivElement>(null)

  const { addSliderEventListeners } = useSliderStore()

  useEffect(() => {
    if (!sliderRef.current) return

    addSliderEventListeners(sliderRef.current)
  }, [])

  return <div ref={sliderRef}>Slider</div>
}
export default Slider
