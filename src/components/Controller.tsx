import { usePlayerStore } from "@/store/player"
import { cn } from "@/lib/utils"
import * as React from "react"

interface ControllerProps {
  children?: React.ReactNode
}

export const Controller = (props: ControllerProps) => {
  const showControls = usePlayerStore((store) => store.showControls)

  return (
    <div
      className={cn(
        "h-full w-full text-white transition-all",
        showControls ? "visible opacity-100" : "invisible opacity-0"
      )}
    >
      <div className="pointer-events-none absolute bottom-0 flex w-full justify-end bg-gradient-to-t from-black to-transparent pt-32 transition-opacity duration-200"></div>
      <div className="pointer-events-auto absolute bottom-0 z-10 mb-[env(safe-area-inset-bottom)] w-full pb-3 pl-[calc(0.5rem+env(safe-area-inset-left))] pr-[calc(0.5rem+env(safe-area-inset-right))] pt-1">
        {props.children}
      </div>
    </div>
  )
}
