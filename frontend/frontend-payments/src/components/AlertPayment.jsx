import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

const AlertPayment = () => {
  const [overduePayments, setOverduePayments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOverduePayments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const token = localStorage.getItem('access_token');
        
        const response = await fetch(
          `http://localhost:8989/api/organizator/date?date=${today}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log("chegou")
        if (response.ok) {
          const data = await response.json();
          setOverduePayments(data);
        }
      } catch (error) {
        console.error('Erro ao buscar pagamentos atrasados:', error);
      }
    };

    fetchOverduePayments();
  }, []);

  if (overduePayments.length === 0) return null;

  return (
    <>
      {/* Popup pequeno */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center animate-bounce">
          <AlertCircle className="mr-2" size={20} />
          <span>Você tem {overduePayments.length} pagamento(s) atrasado(s)</span>
          <button 
            onClick={() => setShowModal(true)}
            className="ml-3 text-sm font-medium underline"
          >
            Veja aqui
          </button>
        </div>
      </div>

      {/* Modal detalhado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Pagamentos Atrasados
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {overduePayments.map((payment) => (
                <div key={payment.id} className="mb-3 last:mb-0 p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">{payment.namePayment}</span>
                    <span className="text-red-400">R$ {payment.valuePayment.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {new Date(payment.paymentDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {payment.description}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertPayment;