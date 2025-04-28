import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cpu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isApp = location.pathname === '/app';
  const [accessCode, setAccessCode] = useState(localStorage.getItem('accessCode') || '');
  const [remainingAccesses, setRemainingAccesses] = useState(
    parseInt(localStorage.getItem('remainingAccesses') || '0')
  );
  const [showAccessInput, setShowAccessInput] = useState(!localStorage.getItem('accessCode'));
  const [error, setError] = useState('');

  const scrollToPlans = () => {
    const plansSection = document.getElementById('pricing-section');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const decrementAccess = async () => {
      if (isApp && accessCode && !showAccessInput) {
        try {
          const { data: decremented, error: decrementError } = await supabase
            .rpc('decrement', { code_param: accessCode })
            .single();

          if (decrementError || decremented === null) {
            console.error('Error decrementing access:', decrementError);
            handleLogout();
            return;
          }

          const { error: updateError } = await supabase
            .from('access_codes')
            .update({ last_used_at: new Date().toISOString() })
            .eq('code', accessCode);

          if (updateError) {
            console.error('Error updating last_used_at:', updateError);
          }

          localStorage.setItem('remainingAccesses', decremented.toString());
          setRemainingAccesses(decremented);

          if (decremented <= 0) {
            handleLogout();
          }
        } catch (error) {
          console.error('Error in decrementAccess:', error);
          handleLogout();
        }
      }
    };

    decrementAccess();
  }, [isApp, accessCode, showAccessInput]);

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: queryError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', accessCode)
        .eq('is_active', true)
        .single();

      if (queryError || !data) {
        setError('Código de acesso inválido');
        return;
      }

      if (data.remaining_accesses <= 0) {
        setError('Código sem acessos restantes');
        return;
      }

      localStorage.setItem('accessCode', accessCode);
      localStorage.setItem('remainingAccesses', data.remaining_accesses.toString());
      setRemainingAccesses(data.remaining_accesses);
      setShowAccessInput(false);
    } catch (err) {
      console.error('Error validating access code:', err);
      setError('Erro ao validar código');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessCode');
    localStorage.removeItem('remainingAccesses');
    setAccessCode('');
    setShowAccessInput(true);
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-4 gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Cpu className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">
                <span className="text-white">GTO</span>{' '}
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                  Pré-Flop
                </span>{' '}
                <span className="text-white">Poker</span>
              </span>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {showAccessInput ? (
              <div className="flex flex-wrap items-center gap-4">
                {location.pathname === '/' && (
                  <button
                    onClick={scrollToPlans}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
                  >
                    Planos
                  </button>
                )}
                <form onSubmit={handleAccessCodeSubmit} className="flex flex-col w-full sm:w-auto">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Código de Acesso"
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
                    >
                      Validar
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-gray-300">
                  Acessos restantes: <span className="font-bold text-blue-400">{remainingAccesses}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-white transition duration-150"
                  title="Sair"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {!isApp && localStorage.getItem('accessCode') && (
              <Link
                to="/app"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Acessar App
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}