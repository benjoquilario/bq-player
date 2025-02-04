import { useProgressStore } from "@/store/progress"
import { formatTime } from "@/lib/utils"

const Time = () => {
  const {
    progress: { draggingTime, time, duration },
  } = useProgressStore()

  return (
    <div>
      <div className="flex items-center text-gray-50">
        <span>{formatTime(draggingTime > 0 ? draggingTime : time)}</span> /{" "}
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
export default Time
