import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import Pricing from "./pages/common/Pricing";
import Terms from "./pages/common/Terms";
import Dashboard from "./pages/Dahboard";
// import Checkout from "./pages/common/Checkout";
// import ConfirmEmail from "./pages/ConfirmEmail";
// import ImportQuestions from "./pages/instructor/ImportQuestions";
// import CreateExam from "./pages/instructor/CreateExam";
// import InstructorDashboard from "./pages/instructor/InstructorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/confirm_email" element={<ConfirmEmail />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/student" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
