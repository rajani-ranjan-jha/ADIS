import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      console.log("Got the token: ", token);
      localStorage.setItem("auth_token", token);
      
      // Navigate to home
      navigate("/");
    } else {
      console.error("No token received. Authentication failed.");
      navigate("/auth");
    }
  }, [searchParams, navigate]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-xl">Authenticating...</p>
    </div>
  );
}
