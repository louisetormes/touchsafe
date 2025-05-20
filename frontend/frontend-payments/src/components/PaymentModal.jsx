import { useState } from 'react';
import { X } from 'lucide-react';

const PaymentModal = ({ payment, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: payment.id,
    namePayment: payment.namePayment || '',
    description: payment.description || '',
    valuePayment: payment.valuePayment || '',
    typePayment: payment.typePayment || 'PAYMENT',
    paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
    clientId: payment.clientId || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const clientIdStorage = localStorage.getItem('client_id');
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:8989/api/organizator/update?id=${payment.id}&client_id=${clientIdStorage}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            namePayment: formData.namePayment,
            description: formData.description,
            valuePayment: formData.valuePayment,
            typePayment: formData.typePayment,
            paymentDate: formData.paymentDate
          })
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao atualizar pagamento');
      }

      onUpdate(); 
      onClose(); 
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Editar Pagamento</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/50 text-red-300 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Nome</label>
            <input
              name="namePayment"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.namePayment}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Descrição</label>
            <input
              name="description"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Valor (R$)</label>
            <input
              name="valuePayment"
              type="number"
              step="0.01"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.valuePayment}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Status</label>
            <select
              name="typePayment"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.typePayment}
              onChange={handleChange}
              required
            >
              <option value="PAYMENT">Realizado</option>
              <option value="NOT_PAYMENT">Não realizado</option>
              <option value="PAYMENT_FUTURE">Futuro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Data</label>
            <input
              name="paymentDate"
              type="date"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.paymentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Pagamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;