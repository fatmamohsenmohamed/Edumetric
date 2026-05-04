import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import Pricing from "./pages/common/Pricing";
import Terms from "./pages/common/Terms";
import Checkout from "./pages/common/Checkout";

import ConfirmEmail from "./pages/ConfirmEmail";

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateExam from "./pages/instructor/CreateEXam";
import QuestionBank from "./pages/instructor/QuestionBank";
import Results from "./pages/instructor/Results";
import ExamsManagement from "./pages/instructor/ExamsManagement";

import Dashboard from "./pages/student/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />

        {/* Common pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Instructor */}
        <Route path="/instructordashboard" element={<InstructorDashboard />} />
        <Route path="/createexam" element={<CreateExam />} />
        <Route path="/questionbank" element={<QuestionBank />} />
        <Route path="/results" element={<Results />} />
        <Route path="/examsmanagement" element={<ExamsManagement />} />
        {/* Student */}
        <Route path="/student" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;