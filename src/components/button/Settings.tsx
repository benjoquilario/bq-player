import { Settings } from "lucide-react"
import IconTooltip from "../IconTooltip"

const SettingButton = () => {
  return (
    <IconTooltip content="Settings">
      <button>
        <Settings className="size-6" />
      </button>
    </IconTooltip>
  )
}
export default SettingButton
