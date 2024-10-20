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
    <Button
      size="icon"
      className="h-6 w-6 text-white hover:bg-transparent"
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
  )
}
export default PlayPauseButton
