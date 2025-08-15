import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import ChatLayout from './components/ChatLayout';
import { nhost } from './nhost';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated on page load
    const initAuth = async () => {
      const user = await nhost.auth.getUser();
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    initAuth();

    // Listen for changes in authentication
    const unsubscribe = nhost.auth.onAuthStateChanged((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await nhost.auth.signOut();
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <ChatLayout onLogout={handleLogout} />;
}

export default App;
