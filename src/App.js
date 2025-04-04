import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <Router basename="/game.github.io">
            <Routes>
                <Route path="/" element={<Main />} />
            </Routes>
        </Router>
    );
}

export default App;