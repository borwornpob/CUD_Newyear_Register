import React from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./components/navbar";
import Register from "./routes/Register";
import Ticket from "./routes/Ticket";
import ErrorPage from "./error-page";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
