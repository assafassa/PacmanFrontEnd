import React, { useState, useEffect ,useRef} from "react";
import Box from "./Box";
import axios from "axios";

function Game({socket}) {
  const [direction, setDirection]=useState("S")
  const [gameStatus, setGameStatus] = useState({
    score: 0, lives:3, isLive: true, isPredator:false , status:"notstarted"
  });
  
  // Example state to manage grid data (optional)
  const [grid, setGrid] = useState(
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 128, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 128, 1],
      [1, 6, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 2, 1, 8, 1, 1, 1, 0, 1, 2, 1, 2, 1],
      [1, 2, 2, 2, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 1],
      [1, 1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 2, 1, 1, 1],
      [0, 0, 0, 2, 0, 0, 0, 112, 0, 0, 0, 2, 0, 0, 0],
      [1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1],
      [1, 1, 2, 2, 1, 2, 1, 1, 1, 2, 1, 2, 2, 1, 1],
      [1, 1, 1, 2, 2, 2, 2, 128, 2, 2, 2, 2, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
  );
 
  
  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection('U');
          break;
        case 'ArrowDown':
          setDirection('D');
          break;
        case 'ArrowLeft':
          setDirection('L');
          break;
        case 'ArrowRight':
          setDirection('R');
          break;
        case 'Enter':
          if (gameStatus.status=="gameover"){
            setGameStatus({
              status: "notstarted",
              lives:3,
              score:0,
              isLive: true,
              isPredator:false
            });
            setDirection("S")
  
          
          }
        break;
        default:
          break;
      }
    };

    // Add the keydown event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    var timeint
    if (gameStatus.status=="notstarted" && direction!="S"){
      
      setGameStatus(prevStatus => ({
        ...prevStatus,
        status: "started"
      }))
      timeint=setInterval(() => {
        axios.post('https://localhost:8080',{direction})
        .then((response) => {
          setGameStatus(response.data);  // Set the response data to the state
          
        })
        .catch((error) => {
          setError('Error fetching data',error);
        });
      }, 1000);///one seond if works can reduce this time!!!!!

    }
    if (gameStatus.status=="gameover"){
      clearInterval(timeint)
      setGameStatus(prev=>({
        prev,
        status:"notstarted"
      }))
    }
    if (socket.current && socket.current.readyState === WebSocket.OPEN && direction!="S") {
      
      socket.current.send(direction);
    }
  }, [direction])
  
  
  return (
    <div style={styles.pageContainer}>
      
      <div style={styles.pageContainer}>
        <div style={styles.topContainer}>
          score: {gameStatus.score}  lives: {gameStatus.lives}
        </div>
        <div style={styles.gridContainer}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <Box key={`${rowIndex}-${colIndex}`} value={cell} direction={direction} 
                isPredator={gameStatus.isPredator} isLive={gameStatus.isLive}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {gameStatus.status=="notstarted" && <div style={styles.messegeContainer}>
        to start press any arrow
      </div>
      }
      {gameStatus.status=="gameover" && <div style={styles.messegeContainer}>
        GAMEOVER
        to play again press enter
      </div>
      }
    </div>
  );
}



// Inline styles
const styles = {
  pageContainer: {
    display: "flex-1",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full viewport height
    backgroundColor: "#010221", // Optional background color
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor:"black"
  },
  row: {
    display: "flex",
  },
  topContainer: {
    color: "white",
    fontSize: "16px", // Adjusted for proper sizing
    fontFamily: "'Press Start 2P', cursive", // Retro pixelated font
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "2px", // Add spacing for an arcade-style look
    fontWeight: "bold", // Make the text bold
    backgroundColor: "black", // Retro games often have dark headers
    padding: "10px", // Add padding to enhance the header look
     // Optional: Add a bottom border for style
    // Glow effect
  },
  messegeContainer:
  {
    color: "white",
    fontSize: "16px", // Adjusted for proper sizing
    fontFamily: "'Press Start 2P', cursive", // Retro pixelated font
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "2px", // Add spacing for an arcade-style look
    fontWeight: "bold", // Make the text bold
     // Retro games often have dark headers
    padding: "10px", // Add padding to enhance the header look
     // Optional: Add a bottom border for style
    // Glow effect
    backgroundColor:"black",
    position: "absolute",
    top: "57%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:"100px",
    
    
  }

  
};

export default Game;
