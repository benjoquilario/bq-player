import { usePlayerStore } from "@/store/player"
import { Maximize } from "lucide-react"
import IconTooltip from "../IconTooltip"
import * as React from "react"

const FullScreen = () => {
  const { toggleFullScreen } = usePlayerStore()

  const handleToggleFullScreen = React.useCallback(() => {
    toggleFullScreen()
  }, [])

  return (
    <IconTooltip content="Full Screen">
      <button onClick={handleToggleFullScreen}>
        <Maximize className="size-7" />
      </button>
    </IconTooltip>
  )
}
export default FullScreen
