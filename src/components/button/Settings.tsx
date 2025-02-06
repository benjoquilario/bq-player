import { Settings } from "lucide-react"
import IconTooltip from "../IconTooltip"
import SettingDialog from "../SettingDialog"
import * as React from "react"
import { usePlayerStore } from "@/store/player"

const SettingsMenu = React.memo(() => {
  const [isOpen, setIsOpen] = React.useState(false)

  const { playbackSpeed, setPlaybackSpeed, qualities } = usePlayerStore()

  const hhandleOnClose = () => {
    setIsOpen(false)
  }

  const handleOnOpen = () => {
    setIsOpen(true)
  }

  const handlePlaySpeedChange = (rate: number) => {
    setPlaybackSpeed(rate)
    setIsOpen(false)
  }

  console.log(qualities)

  return (
    <>
      <IconTooltip content="Settings">
        <button onClick={handleOnOpen}>
          <Settings className="size-6" />
        </button>
      </IconTooltip>
      <SettingDialog
        playbackSpeed={playbackSpeed}
        onPlaybackSpeedChange={handlePlaySpeedChange}
        isOpen={isOpen}
        onClose={hhandleOnClose}
      />
    </>
  )
})

SettingsMenu.displayName = "SettingsMenu"

export default SettingsMenu
