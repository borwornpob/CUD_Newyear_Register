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

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ChakraRegister />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/chakra" element={<ChakraRegister />} />
          <Route
            path="/deleteTicket/:id/:password"
            element={<DeleteTicket />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
