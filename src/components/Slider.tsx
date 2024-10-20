import { usePlayerStore } from "@/store/player"
import { Slider } from "./ui/slider"
import { useProgressStore } from "@/store/progress"

const TimeSlider = () => {
  const seek = usePlayerStore((store) => store.seek)

  const {
    progress: { buffered, draggingTime, duration, time },
    setDraggingTime,
  } = useProgressStore()

  return (
    <Slider
      max={duration}
      step={1}
      value={[draggingTime == -1 ? time : draggingTime]}
      onPointerDown={() => setDraggingTime(time)}
      onValueChange={(value) => setDraggingTime(value[0])}
      onValueCommit={(value) => {
        seek(value[0])
      }}
    />
  )
}
export default TimeSlider
