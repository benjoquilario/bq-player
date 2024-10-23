import { usePlayerStore } from "@/store/player"
import { Slider } from "./ui/slider"
import { Button } from "./ui/button"
import * as React from "react"
import { MdVolumeUp, MdVolumeOff } from "react-icons/md"

const Volume = () => {
  const { volume, videoEl } = usePlayerStore()
  const previousVolume = React.useRef(volume)

  const handleClick = React.useCallback(() => {
    if (!videoEl) return

    if (videoEl.volume === 0) {
      videoEl.volume = previousVolume.current
    } else {
      previousVolume.current = videoEl.volume
      videoEl.volume = 0
    }
  }, [videoEl])

  const handleVolumeChange = React.useCallback(
    (percent: number) => {
      if (!videoEl) return

      videoEl.volume = percent / 100
    },
    [videoEl]
  )

  return (
    <div className="flex w-full items-center">
      <Button className="h-10 w-12 p-2" onClick={handleClick} variant="opacity">
        {volume === 0 ? (
          <MdVolumeOff
            className="text-white"
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <MdVolumeUp
            className="text-white"
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </Button>
      <div className="w-full">
        <Slider
          min={0}
          max={100}
          step={1}
          value={[volume * 100]}
          onPointerDown={() => console.log("pointer down")}
          onValueChange={(value) => handleVolumeChange(value[0])}
          // onValueCommit={(value) => console.log(value)}
          className="relative flex w-[60px] items-center md:w-[80px]"
        />
      </div>
    </div>
  )
}
export default Volume
