
import { createRoot } from 'react-dom/client';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import { Spinner } from './components/ui/spinner';

// Get publishable key from environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Create a root element for React rendering
const rootElement = document.getElementById("root");

// If no publishable key is provided and we're in development mode, render the app without Clerk
if ((!PUBLISHABLE_KEY || PUBLISHABLE_KEY === "pk_test_placeholder") && isDevelopment) {
  console.warn("No valid Clerk publishable key found. Running in development mode without authentication.");
  
  createRoot(rootElement!).render(<App />);
} else {
  // In production or if we have a valid key, use Clerk authentication
  createRoot(rootElement!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ""}>
      <ClerkLoading>
        <div className="h-screen w-screen flex items-center justify-center">
          <Spinner size="lg" />
          <span className="ml-2">Loading authentication...</span>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <App />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
