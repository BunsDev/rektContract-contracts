import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  console.log(prompt)
  const generatePrompt = async (prompt) => {
    fetch(`http://localhost:5000/prompt?value=${prompt}`)
      .then((res) => res.json())
      .then((data) => setMessage(data.bro));
  }
  // const submitPrompt = async (prompt) =>{
  //   fetch(`http://localhost:5000/prompt?value={prompt}`)

  // }
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.Dheeraj));
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
      <button onClick={() => generatePrompt("Spark Server")}> OpenAI</button>

      <form onSubmit={(e) => { e.preventDefault(); generatePrompt(prompt) }}>
        <label>
          Is going:
          <input
            type="text"
            placeholder="Enter the prompt"
            onChange={(e) => { setPrompt(e.target.value) }} />
        </label>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
