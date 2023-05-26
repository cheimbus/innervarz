import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [count, setCount] = useState(0);
  const [imageData, setImageData] = useState(null);

  const handleClick = async () => {
    setCount((prevCount) => prevCount + 1);
    try {
      const response = await axios.get(
        `http://13.125.211.113:7929/image/${count}`
      );
      setImageData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Increase Count</button>
      <div>{count}</div>
      {imageData && <img src={imageData.imageUrl} alt={`Image ${count}`} />}
    </div>
  );
};

export default App;
