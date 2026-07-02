import React, { useState, useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import LawyerDashboard from "./components/LawyerDashboard";
import ClientDashboard from "./components/ClientDashboard";
import AdminDashboard from "./components/AdminDashboard";
import GlobalUI from "./components/GlobalUI";

function AppContent() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isAuthenticated, currentUser?.role, showLogin]);

  if (!isAuthenticated || !currentUser) {
    if (showLogin) {
      return <Login onBackToLanding={() => setShowLogin(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  if (currentUser.role === "admin") {
    return <AdminDashboard />;
  }

  if (currentUser.role === "lawyer") {
    return <LawyerDashboard />;
  }

  return <ClientDashboard />;
}

export default function App() {
  return (
    <Provider store={store}>
      <GlobalUI />
      <AppContent />
    </Provider>
  );
}
