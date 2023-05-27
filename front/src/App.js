import React, { useState } from "react";
import axios from "axios";
import innerberzlogo from "./innerberzlogo.jpg";

const App = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [showUploadText, setShowUploadText] = useState(true);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setResult("");
    setShowUploadText(false);
  };

  const handleGuess = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        "http://13.125.211.113:7929/guess",
        formData
      );
      setResult(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const imageButtonStyle = {
    display: "block",
    width: "400px",
    height: "400px",
    border: "1px solid #ccc",
    position: "relative",
  };

  const uploadTextStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "gray",
  };

  const guessButtonStyle = {
    width: "200px",
    height: "30px",
    backgroundColor: "white",
    marginTop: "50px",
  };

  const titleStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "55px",
    backgroundColor: "#333",
    marginBottom: "80px",
  };

  const logoStyle = {
    width: "250px",
    height: "auto",
    marginRight: "10px",
  };

  const resultStyle = {
    width: "380px",
    height: "20px",
    backgroundColor: "lightgray",
    marginTop: "150px",
    padding: "10px",
    textAlign: "center",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const innerberzlogoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <img src={innerberzlogo} alt="Logo" style={logoStyle} />
      </div>
      <label htmlFor="imageUpload" style={imageButtonStyle}>
        {showUploadText && <div style={uploadTextStyle}>Upload Image</div>}
        {image && (
          <img src={URL.createObjectURL(image)} style={innerberzlogoStyle} />
        )}
      </label>
      <input
        id="imageUpload"
        type="file"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <button style={guessButtonStyle} onClick={handleGuess}>
        Guess gender
      </button>
      <div style={resultStyle}>{result}</div>
    </div>
  );
};

export default App;
