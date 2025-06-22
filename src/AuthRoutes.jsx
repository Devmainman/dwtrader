import { Routes, Route } from "react-router-dom";
import LoginPage from "./desktopcomponents/authpages/loginpage/LoginScreen";
// Add RegisterPage, ForgotPassword, etc if needed

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginPage />} />
      {/* Add more auth-related routes here */}
    </Routes>
  );
}

export default AuthRoutes;
