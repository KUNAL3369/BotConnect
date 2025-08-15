import React from 'react';
import { useState } from 'react';
import { useAuthenticationStatus } from '@nhost/react';
import { hasValidConfig } from './lib/nhost';
import NhostLogin from './components/NhostLogin';
import NhostSignup from './components/NhostSignup';
import GraphQLChatInterface from './components/GraphQLChatInterface';
import DemoModeInterface from './components/DemoModeInterface';

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const [showSignup, setShowSignup] = useState(false);

  // If no valid Nhost configuration, show demo mode
  if (!hasValidConfig) {
    return <DemoModeInterface />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <GraphQLChatInterface />;
  }

  if (showSignup) {
    return <NhostSignup onSwitchToLogin={() => setShowSignup(false)} />;
  }

  return <NhostLogin onSwitchToSignup={() => setShowSignup(true)} />;
}

export default App;