import React, { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializa o SDK do Mercado Pago com a chave pública
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY as string);

interface Plan {
  name: string;
  accesses: number;
  price: string;
  features: string[];
  popular?: boolean;
}

interface MercadoPagoCheckoutProps {
  plan: Plan;
  onClose: () => void;
}

const MercadoPagoCheckout: React.FC<MercadoPagoCheckoutProps> = ({ plan, onClose }) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para extrair o valor numérico do preço (ex: "R$ 29,90" -> 29.90)
  const extractNumericPrice = (priceString: string): number => {
    const numericString = priceString.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(numericString);
  };

  // Função para criar a preferência de pagamento
  const createPreference = async () => {
    setLoading(true);
    setError(null);

    try {
      const numericPrice = extractNumericPrice(plan.price);
      
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration: 1, // Duração em meses
          amount: numericPrice,
          description: `${plan.name} - ${plan.accesses} acessos`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar preferência de pagamento');
      }

      const data = await response.json();
      setPreferenceId(data.id);
    } catch (err) {
      console.error('Erro ao criar preferência:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  // Criar preferência ao montar o componente
  React.useEffect(() => {
    createPreference();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-4">{plan.name}</h2>
        <p className="text-gray-300 mb-6">Valor: {plan.price}</p>
        
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6">
            <p>{error}</p>
            <button 
              onClick={createPreference}
              className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        )}
        
        {preferenceId && !loading && !error && (
          <div className="flex flex-col items-center">
            <Wallet 
              initialization={{ preferenceId }}
              customization={{
                texts: {
                  action: 'Pagar',
                  valueProp: 'Pagamento seguro'
                },
                visual: {
                  buttonBackground: 'blue',
                  borderRadius: '8px'
                }
              }}
            />
            <p className="text-sm text-gray-400 mt-4 text-center">
              Ao clicar em "Pagar", você será redirecionado para o Mercado Pago para concluir sua compra com segurança.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MercadoPagoCheckout;