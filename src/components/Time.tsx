import { useProgressStore } from "@/store/progress"
import { Button } from "./ui/button"
import { formatTime } from "@/lib/utils"

const Time = () => {
  const {
    progress: { draggingTime, time, duration },
  } = useProgressStore()

  return (
    <Button variant="ghost" className="hover:bg-transparent hover:text-white">
      {formatTime(draggingTime > 0 ? draggingTime : time)} /{" "}
      {formatTime(duration)}
    </Button>
  )
}
export default Time
