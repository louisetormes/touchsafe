import { useEffect, useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import PaymentModal from '../components/PaymentModal';
import AlertPayment from '../components/AlertPayment';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [form, setForm] = useState({
    id: '',
    namePayment: '',
    description: '',
    valuePayment: '',
    paymentDate: '',
    typePayment: '',
    user: ''
  });
  const [filterText, setFilterText] = useState('');
  const [message, setMessage] = useState('');

  const fetchPayments = () => {
    const clientId = localStorage.getItem('client_id');
    const token = localStorage.getItem('access_token');
    
    if (!clientId) {
      console.warn("client_id não encontrado no localStorage");
      setPayments([]);
      return;
    }

    fetch(`http://localhost:8989/api/organizator/return/payment?client_id=${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
        return res.json();
      })
      .then(data => setPayments(data))
      .catch(err => {
        console.error(err);
        setPayments([]);
        showMessage('Erro ao carregar pagamentos.');
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('access_token');
    const clientId = localStorage.getItem('client_id');
  
    const payload = {
      ...form,
      user: clientId 
    };
  
    await fetch('http://localhost:8989/api/organizator/send/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  
    setForm({ 
      id: '',
      namePayment: '', 
      description: '', 
      valuePayment: '', 
      paymentDate: '', 
      typePayment: '', 
      user: '' 
    });
    fetchPayments();
    showMessage('Pagamento salvo com sucesso!');
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('access_token');
    fetch(`http://localhost:8989/api/organizator/delete?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      fetchPayments();
      showMessage('Pagamento excluído com sucesso!');
    });
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const filteredPayments = payments.filter(p =>
    p.namePayment.toLowerCase().includes(filterText.toLowerCase())
  );
 
  return (
    <div className="p-6 max-w-7xl mx-auto font-rubik text-gray-100">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight">
          Gerenciador de Pagamentos
        </h1>
        {message && (
          <div className="bg-green-900/50 border border-green-500 text-green-100 px-4 py-2 rounded-lg mb-4 shadow-lg backdrop-blur-sm">
            {message}
          </div>
        )}
      </div>

      {/* Formulário */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 p-6 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Nome</label>
            <input
              className="w-full bg-gray-900/70 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Ex: Internet"
              value={form.namePayment}
              onChange={e => setForm({ ...form, namePayment: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Descrição</label>
            <input
              className="w-full bg-gray-900/70 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Ex: Mensalidade"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Valor (R$)</label>
            <input
              className="w-full bg-gray-900/70 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="0,00"
              type="number"
              step="0.01"
              value={form.valuePayment}
              onChange={e => setForm({ ...form, valuePayment: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Status</label>
            <select
              className="w-full bg-gray-900/70 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
              value={form.typePayment || "default"}
              onChange={e => {
                const selected = e.target.value === "default" ? "" : e.target.value;
                setForm({ ...form, typePayment: selected });
              }}
              required
            >
              <option value="default" disabled hidden>Selecione</option>
              <option value="PAYMENT">Realizado</option>
              <option value="NOT_PAYMENT">Não realizado</option>
              <option value="PAYMENT_FUTURE">Futuro</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Data</label>
            <input
              className="w-full bg-gray-900/70 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              type="date"
              value={form.paymentDate}
              onChange={e => setForm({ ...form, paymentDate: e.target.value })}
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Salvar Pagamento
            </button>
          </div>
        </form>
      </div>

      {/* Filtro e Tabela */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/60 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{p.namePayment}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{p.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-medium">R$ {Number(p.valuePayment).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(p.paymentDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{p.typePayment}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      p.typePayment === 'PAYMENT' ? 'bg-green-900/50 text-green-300' :
                      p.typePayment === 'NOT_PAYMENT' ? 'bg-red-900/50 text-red-300' :
                      'bg-blue-900/50 text-blue-300'
                    }`}>
                      {p.typePayment === 'PAYMENT' && 'Realizado'}
                      {p.typePayment === 'NOT_PAYMENT' && 'Não realizado'}
                      {p.typePayment === 'PAYMENT_FUTURE' && 'Futuro'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingPayment(p)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-blue-900/30 transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-900/30 transition-colors duration-200"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum pagamento encontrado. Adicione um novo pagamento acima.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dashboard de resumo */}
      <div className="mt-8">
        <Dashboard />
      </div>

      {/* Modal de edição */}
      {editingPayment && (
        <PaymentModal
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onUpdate={() => {
            fetchPayments();
            showMessage('Pagamento atualizado com sucesso!');
          }}
        />
      )}
      <AlertPayment />
    </div>
  );
}