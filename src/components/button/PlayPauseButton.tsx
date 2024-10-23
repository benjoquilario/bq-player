import { usePlayerStore } from "@/store/player"
import { Button } from "../ui/button"
import { FaPlay, FaPause } from "react-icons/fa"

const PlayPauseButton = () => {
  const { isPaused, videoEl, play, pause } = usePlayerStore()

  const handleClick = () => {
    if (!videoEl) return

    if (isPaused) play()
    else pause()
  }

  return (
    <div className="inline-flex items-center justify-center">
      <Button
        size="icon"
        className="h-10 w-10 p-2 text-white hover:bg-white/50"
        variant="ghost"
        onClick={handleClick}
      >
        {isPaused ? (
          <FaPlay
            style={{ height: "100%", width: "100%" }}
            className="text-white"
          />
        ) : (
          <FaPause
            style={{ height: "100%", width: "100%" }}
            className="text-white"
          />
        )}
      </Button>
    </div>
  )
}
export default PlayPauseButton
