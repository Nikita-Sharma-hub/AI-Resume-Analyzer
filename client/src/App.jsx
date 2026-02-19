import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000")
      .then(res => setMessage(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>AI Resume Analyzer 💼</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;
