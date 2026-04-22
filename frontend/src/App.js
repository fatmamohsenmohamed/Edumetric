import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import Pricing from "./pages/common/Pricing";
import Terms from './pages/common/Terms';
import Teacher_Dashboard from "./pages/Teacher_Dashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/teacher_dashboard" element={<Teacher_Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
