import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import AuthCallback from "./components/AuthCallback";
import Sidebar from "./components/Sidebar";
import HeroSection from "./components/HeroSection";
import MessageContainer from "./components/MessageContainer";
import VoiceAssistantUI from "./components/AssistantUI";
import VoiceAssistantNewUI from "./components/AssistantNewUI";
import { useState } from "react";

const Home = () => {
  const token = localStorage.getItem("auth_token");
  const [opened, setOpened] = useState(false);

  if (!token) {
    console.log('not logged in')
    // return <Navigate to="/auth" />;
  }
  else{
    console.log('logged in')
  }

  // TODO: implement via redux(component handling, user info, etc)
  return (
    <div className="min-w-screen min-h-screen flex justify-between overflow-hidden relative">
      <Sidebar />
      {opened ? <VoiceAssistantNewUI setOpened={setOpened}/> : <HeroSection setOpened={setOpened} />}
      {/* <VoiceAssistantNewUI setOpened={setOpened}/> */}
      {/* <HeroSection /> */}
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
