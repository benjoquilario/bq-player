import { GrForwardTen, GrBackTen } from "react-icons/gr"
import { Button } from "@/components/ui/button"
import { usePlayerStore } from "@/store/player"

type SkipButtonProps = {
  skipSeconds?: number
}

const SkipButton: React.FC<SkipButtonProps> = ({ skipSeconds = 10 }) => {
  const { skipForwardSeconds, skipBackwardSeconds } = usePlayerStore()

  return (
    <div className="ml-2 flex items-center gap-2">
      <Button
        className="h-9 w-8 p-0.5 text-white hover:bg-transparent hover:text-white"
        onClick={() => skipBackwardSeconds(skipSeconds)}
        variant="ghost"
      >
        <GrBackTen style={{ height: "100%", width: "100%" }} />
      </Button>
      <Button
        className="h-8 w-8 p-0.5 text-white hover:bg-transparent hover:text-white"
        onClick={() => skipForwardSeconds(skipSeconds)}
        variant="ghost"
      >
        <GrForwardTen style={{ height: "100%", width: "100%" }} />
      </Button>
    </div>
  )
}
export default SkipButton
