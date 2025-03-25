import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GtoCalculator from './components/GtoCalculator';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import { supabase } from './lib/supabase';

function RequireAuth({ children }: { children: JSX.Element }) {
  const [isValidating, setIsValidating] = React.useState(true);
  const [isValid, setIsValid] = React.useState(false);
  const storedAccessCode = localStorage.getItem('accessCode');

  React.useEffect(() => {
    async function validateAccess() {
      if (!storedAccessCode) {
        setIsValidating(false);
        return;
      }

      try {
        // Only check if the code exists and is valid, no decrement
        const { data: accessCodeData, error: checkError } = await supabase
          .from('access_codes')
          .select('remaining_accesses')
          .eq('code', storedAccessCode)
          .eq('is_active', true)
          .gt('remaining_accesses', 0)
          .single();

        setIsValid(!!accessCodeData && !checkError);
        setIsValidating(false);
      } catch (error) {
        console.error('Error in validateAccess:', error);
        setIsValid(false);
        setIsValidating(false);
      }
    }

    validateAccess();
  }, [storedAccessCode]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <GtoCalculator />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;