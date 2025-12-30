import "./index.css"; // Tailwind読み込み
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
// import ReactGA from "react-ga4";

import ReactGA from "react-ga4";

ReactGA.initialize("G-W3M8628BRB", { debug: true });
ReactGA.send("pageview");


function getSessionId() {
  let id = localStorage.getItem("quiz_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("quiz_session_id", id);
  }
  return id;
}


const sessionId = getSessionId();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz" element={<App />} />
        </Routes>
    
    </BrowserRouter>
    <App sessionId={sessionId} />
  </React.StrictMode>
);



