import "./index.css"; // Tailwind読み込み
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
// import ReactGA from "react-ga4";

import ReactGA from "react-ga4";

ReactGA.initialize("G-W3M8628BRB", { debug: true });
ReactGA.send("pageview");


// const ReactGA = await import('react-ga4')
// ReactGA.default.initialize("G-W3M8628BRB",{
//   debug:true,
// })


// ReactGA.initialize("G-W3M8628BRB",{
//   debug:true,
// })
// ReactGA.default.send("pageview")
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz" element={<App />} />
        </Routes>
    
    </BrowserRouter>
  </React.StrictMode>
);
