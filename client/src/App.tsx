import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import AuthCallback from "./components/AuthCallback";
import Sidebar from "./components/Sidebar";
import HeroSection from "./components/HeroSection";
import MessageContainer from "./components/MessageContainer";
import VoiceAssistantUI from "./components/AssistantUI";
import VoiceAssistantNewUI from "./components/AssistantNewUI";

const Home = () => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    console.log('not logged in')
    // return <Navigate to="/auth" />;
  }
  else{
    console.log('logged in')
  }

  return (
    <div className="min-w-screen min-h-screen flex justify-between overflow-hidden">
      <Sidebar />
      {/* <VoiceAssistantNewUI/> */}
      {/* <VoiceAssistantUI/> */}
      <HeroSection />
      {/* <MessageContainer/> */}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
    
  );
}
