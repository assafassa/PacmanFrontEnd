import React from 'react'

function Box({ value,direction,isPredator,die }) {
  function binaryPowerSequence(num) {
    const binary = num.toString(2).split("").reverse();

    // Pad the binary array with leading zeroes to ensure it's at least 5 bits long
    while (binary.length < 7) {
      binary.push("0");
    }

    return binary;
  }

  var result = binaryPowerSequence(value);

  return (
    <div style={styles.box}>
      {result[0] == 1 && <img height="40px" src="/brick.png" alt="Brick" style={styles.image} />}
      {result[1] == 1 && <img height="23px" src="/coin.gif" alt="Coin" style={styles.image} />}
      {result[7] == 1 && <img height="35px" src="/specialcoin.gif" alt="Coin" style={styles.image} />}
      {result[2] == 1 && <img height="30px" src="/cherry.png" alt="Cherry" style={styles.image} />}
      {result[3] == 1 && <img height="25px" src={die?"/dyingpacman.gif": "/pacman.gif"} alt="packman" style={
        {
            position: "absolute",
            transform: direction=="U" ? "rotate(270deg)":direction=="L" ? "scaleX(-1)":direction=="D" ? "rotate(90deg)":"rotate(0deg)"
        }
      } />}
      
      {result[6] == 1 && <img height="30px" src={isPredator ?"/runghost.gif":"/ghost3.gif"} alt="ghost3" style={styles.image} />}
      {result[5] == 1 && <img height="30px" src={isPredator ?"/runghost.gif":"/ghost2.gif"} alt="ghost2" style={styles.image} />}
      {result[4] == 1 && <img height="30px" src={isPredator ?"/runghost.gif":"/ghost1.gif"} alt="ghost1" style={styles.image} />}

      
      
    </div>
  );
}

const styles = {
  box: {
    width: "40px",
    font: "10px",
    height: "40px",
    position: "relative", // Set relative position for stacking images
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    
  },
  image: {
    position: "absolute", // Stack the images on top of each other
  }
};

export default Box;
