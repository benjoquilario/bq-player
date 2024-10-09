import { useRef, useState, useEffect } from "react"
import Video from "./Video"
import { usePlayerStore } from "@/store/player"

const Player = () => {
  const divEl = useRef<HTMLDivElement>(null)
  const { addPlayerEventListeners } = usePlayerStore()

  useEffect(() => {
    if (!divEl.current) return

    addPlayerEventListeners(divEl.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="relative overflow-hidden"
      ref={divEl}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Video
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        playsInline
        autoPlay={true}
      />
    </div>
  )
}
export default Player
