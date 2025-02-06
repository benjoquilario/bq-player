import { usePlayerStore } from "@/store/player"
import IconTooltip from "../IconTooltip"
import { Play, Pause } from "lucide-react"

const PlayPauseButton = () => {
  const { togglePlay, isPaused } = usePlayerStore()

  return (
    <div className="inline-flex items-center justify-center">
      <IconTooltip content={isPaused ? "Play" : "Pause"}>
        <button onClick={togglePlay}>
          {isPaused ? (
            <Play className="size-6" />
          ) : (
            <Pause className="size-6" />
          )}
        </button>
      </IconTooltip>
    </div>
  )
}
export default PlayPauseButton
