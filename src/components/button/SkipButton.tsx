import { GrForwardTen, GrBackTen } from "react-icons/gr"
import { Button } from "@/components/ui/button"
import { usePlayerStore } from "@/store/player"

type SkipButtonProps = {
  skipSeconds?: number
}

const SkipButton: React.FC<SkipButtonProps> = () => {
  const { skipForwardSeconds, skipBackwardSeconds } = usePlayerStore()

  return (
    <div className="ml-2 flex items-center gap-1">
      <Button
        className="h-10 w-10 p-2"
        onClick={() => skipBackwardSeconds(10)}
        variant="opacity"
      >
        <GrBackTen style={{ height: "100%", width: "100%" }} />
      </Button>
      <Button
        className="h-10 w-10 p-2"
        onClick={() => skipForwardSeconds(10)}
        variant="opacity"
      >
        <GrForwardTen style={{ height: "100%", width: "100%" }} />
      </Button>
    </div>
  )
}
export default SkipButton
