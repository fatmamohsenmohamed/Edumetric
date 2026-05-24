import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import Pricing from "./pages/common/Pricing";
import Terms from "./pages/common/Terms";
import Checkout from "./pages/common/Checkout";
import ConfirmEmail from "./pages/auth/ConfirmEmail";

// Instructor
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateExam from "./pages/instructor/CreateEXam";

import Results from "./pages/instructor/Results";
import ExamsManagement from "./pages/instructor/ExamsManagement";

import QuestionBank from "./pages/instructor/QuestionBank";
// student
import Dashboard from "./pages/student/Dashboard";
import TakeExam from "./pages/student/Takeexam";

import AvailableExams from "./pages/student/Availableexams";
import Certificate from "./pages/student/Certificate";
import MyResults from "./pages/student/StudentResult";
import ResultDetail from "./pages/student/ResultDetail";

// admin
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
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
        <Route path="/takeexam/:id" element={<TakeExam />} />
        <Route path="/testexam" element={<AvailableExams />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/my-results" element={<MyResults />} />
        <Route path="/my-results/:id" element={<ResultDetail />} />

        {/* Admin */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
