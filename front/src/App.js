import React, { useState } from "react";
import axios from "axios";
import image from "./innerberzlogo.jpg";

const App = () => {
  const [count, setCount] = useState(0);
  const [imageData, setImageData] = useState(null);
  const [showText, setShowText] = useState(true);
  const [result, setResult] = useState("");

  const handleClick = async () => {
    let newCount = count + 1;
    if (newCount > 5) {
      newCount = 1;
    }
    setCount(newCount);

    try {
      const response = await axios.get(
        `http://13.125.211.113:7929/image/${newCount}`
      );
      setImageData(response.data.data);
      console.log(response.data.data);
      setResult("");
    } catch (error) {
      console.error(error);
    }

    setShowText(false);
  };

  const handleGuess = async () => {
    try {
      const response = await axios.post(
        `http://13.125.211.113:7929/guess/${count}`
      );
      setResult(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
  };

  const titleStyle = {
    width: "100%",
    height: "6vh",
    backgroundColor: "#333333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  };

  const leftContentStyle = {
    display: "flex",
    alignItems: "center",
  };

  const rightContentStyle = {
    display: "flex",
    alignItems: "center",
    color: "white",
    fontSize: "20px",
  };

  const imageButtonStyle = {
    width: "400px",
    height: "450px",
    backgroundImage: `url(${imageData && imageData})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginTop: "100px",
    marginBottom: "50px",
  };

  const smallButtonStyle = {
    height: "50px",
    width: "200px",
    backgroundColor: "white",
  };

  const divStyle = {
    marginTop: "10px",
    backgroundColor: "#f2f2f2",
    width: "400px",
    height: "30px",
    display: "flex",
    marginTop: "100px",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <div style={leftContentStyle}>
          <img src={image} width="300" height="61" />
          <h1></h1>
        </div>
        <div style={rightContentStyle}>
          <p>pre-task page</p>
        </div>
      </div>
      <button onClick={handleClick} style={imageButtonStyle}>
        {showText && "imageButton"}
      </button>
      <div style={{ marginBottom: "1px" }} />
      <button
        style={smallButtonStyle}
        onClick={handleGuess}
        disabled={!imageData}
      >
        Guess gender
      </button>
      <div style={divStyle}>{result}</div>
    </div>
  );
};

export default App;
