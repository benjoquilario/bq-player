import "./App.css"
import Player from "@/components/Player"

import * as React from "react"

function App() {
  const playerRef = React.useRef<HTMLVideoElement>(null)

  return (
    <Player
      className="font-geist"
      ref={playerRef}
      sources={[
        {
          file: "https://m3u8proxy.benjoquilario.workers.dev/?url=https%3A%2F%2Fwww034.anzeat.pro%2Fstreamhls%2F8bc7e56bf518ad8e1a42e82c0ce51e1d%2Fep.4.1709270641.480.m3u8",
        },
      ]}
      subtitles={[
        {
          file: "https://s.megastatics.com/subtitle/73fd2e74257659a8ef9b9cdd004623a5/eng-2.vtt",
          lang: "en",
          language: "English",
        },
      ]}
      playsInline
      autoPlay={true}
    />
  )
}

export default App
