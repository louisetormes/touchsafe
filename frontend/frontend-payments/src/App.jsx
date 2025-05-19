import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import Payments from './pages/Payments';
import Login from "./pages/Login";


export default function App() {
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Payments />} />
          </Routes>
        </Router>
      );
    }