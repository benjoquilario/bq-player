import { usePlayerStore } from "@/store/player"
import { FaPlay, FaPause } from "react-icons/fa"
import IconTooltip from "../IconTooltip"

const PlayPauseButton = () => {
  const { isPaused, videoEl, play, pause } = usePlayerStore()

  const handleClick = () => {
    if (!videoEl) return

    if (isPaused) play()
    else pause()
  }

  return (
    <div className="inline-flex items-center justify-center">
      <IconTooltip content={isPaused ? "Play" : "Pause"}>
        <button className="" onClick={handleClick}>
          {isPaused ? (
            <FaPlay className="size-5 text-white" />
          ) : (
            <FaPause className="size-5 text-white" />
          )}
        </button>
      </IconTooltip>
    </div>
  )
}
export default PlayPauseButton
