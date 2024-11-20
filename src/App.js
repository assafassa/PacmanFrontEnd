import React,{useRef} from 'react'
import Game from './Game'

function App() {
    const socket = useRef(null);
  return (
    <Game socket={socket}
    />
  )
}

export default App