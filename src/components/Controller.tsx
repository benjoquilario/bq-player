import { usePlayerStore } from "@/store/player"

interface ControllerProps {
  children?: React.ReactNode
}

export const Controller = (props: ControllerProps) => {
  const showControls = usePlayerStore((store) => store.showControls)

  return (
    showControls && (
      <div className="h-full w-full text-white">
        <div className="pointer-events-none absolute bottom-0 flex w-full justify-end bg-gradient-to-t from-black to-transparent pt-32 transition-opacity duration-200"></div>
        <div className="pointer-events-auto absolute bottom-0 z-10 mb-[env(safe-area-inset-bottom)] w-full pb-3 pl-[calc(0.5rem+env(safe-area-inset-left))] pr-[calc(0.5rem+env(safe-area-inset-right))]">
          {props.children}
        </div>
      </div>
    )
  )
}
