import "./App.css"
import Player from "@/components/Player"

import * as React from "react"

function App() {
  const playerRef = React.useRef<HTMLVideoElement>(null)

  return (
    <Player
      ref={playerRef}
      sources={[
        {
          file: "https://www088.anzeat.pro/streamhls/0b594d900f47daabc194844092384914/ep.1.1703914189.m3u8",
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
      controls
    />
  )
}

export default App
