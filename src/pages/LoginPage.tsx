
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/draw";
  
  useEffect(() => {
    // If user is already authenticated, redirect to the draw page
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      <AuthForm />
    </div>
  );
};

export default LoginPage;
