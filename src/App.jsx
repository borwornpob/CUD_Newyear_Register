import React from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./components/navbar";
import Register from "./routes/Register";
import Ticket from "./routes/ChakraTicket";
import ErrorPage from "./error-page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, DarkMode, VStack } from "@chakra-ui/react";
import ChakraRegister from "./routes/ChakraRegister";
import theme from "./helper/theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DeleteTicket from "./routes/DeleteTicket";
import CheckAtFront from "./routes/CheckAtFront";
import ClosingRegister from "./routes/ClosingRegister";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ClosingRegister />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/deleteTicket/:id/:password"
            element={<DeleteTicket />}
          />
          <Route path="/emergency" element={<ChakraRegister />} />
          <Route path="/checkAtFront/:id" element={<CheckAtFront />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
