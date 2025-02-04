import { usePlayerStore } from "@/store/player"
import { Slider } from "./ui/slider"
import * as React from "react"
import { MdVolumeUp, MdVolumeOff } from "react-icons/md"
import IconTooltip from "./IconTooltip"

const Volume = () => {
  const { volume, videoEl, showVolumeListener, showVolume } = usePlayerStore()
  const previousVolume = React.useRef(volume)
  const volumeEl = React.useRef<HTMLDivElement>(null)

  const handleClick = React.useCallback(() => {
    if (!videoEl) return

    if (videoEl.volume === 0) {
      videoEl.volume = previousVolume.current
    } else {
      previousVolume.current = videoEl.volume
      videoEl.volume = 0
    }
  }, [videoEl])

  React.useEffect(() => {
    if (!volumeEl.current) return

    showVolumeListener(volumeEl.current)
  }, [])

  const handleVolumeChange = React.useCallback(
    (percent: number) => {
      if (!videoEl) return

      videoEl.volume = percent / 100
    },
    [videoEl]
  )

  return (
    <div ref={volumeEl} className="flex w-full items-center transition-all">
      <IconTooltip content={volume === 0 ? "Unmute" : "mute"}>
        <button onClick={handleClick}>
          {volume === 0 ? (
            <MdVolumeOff className="size-7 text-white" />
          ) : (
            <MdVolumeUp className="size-7 text-white" />
          )}
        </button>
      </IconTooltip>

      {showVolume && (
        <div className="relative flex w-full items-center justify-start transition-all">
          <Slider
            min={0}
            max={100}
            step={1}
            value={[volume * 100]}
            onPointerDown={() => console.log("pointer down")}
            onValueChange={(value) => handleVolumeChange(value[0])}
            // onValueCommit={(value) => console.log(value)}
            className="relative z-10 flex w-[52px] cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}
export default Volume
