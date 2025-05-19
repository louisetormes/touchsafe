import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [allPayments, setAllPayments] = useState([]);
  const [groupedPayments, setGroupedPayments] = useState({
    PAYMENT: [],
    NOT_PAYMENT: [],
    PAYMENT_FUTURE: []
  });

  const clientId = localStorage.getItem('client_id');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!clientId || !token) return;

    fetch(`http://localhost:8989/api/organizator/return/payment?client_id=${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setAllPayments(data);

        console.log("aqui" + data);
        const pagamentosPorTipo = {
          PAYMENT: data.filter(p => p.typePayment === "Pagamento realizado."),
          NOT_PAYMENT: data.filter(p => p.typePayment === "Pagamento não realizado."),
          PAYMENT_FUTURE: data.filter(p => p.typePayment === "Pagamento futuro.")
        };

        setGroupedPayments(pagamentosPorTipo);
      })
      .catch(error => {
        console.error('Erro ao buscar pagamentos:', error);
      });
  }, [clientId, token]);

  return (
    <div className="p-6 max-w-6xl mx-auto font-rubik text-white">
    <h1 className="text-3xl font-bold mb-6 text-blue-500">Resumo de Pagamentos</h1>

    {/* Seção do gráfico */}
    <div className="bg-gray-900 rounded-xl shadow p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Distribuição de Pagamentos</h2>
      <div className="h-64">
        <Pie 
          data={{
            labels: ['Realizados', 'Não Realizados', 'Futuros'],
            datasets: [{
              data: [
                groupedPayments['PAYMENT']?.length || 0,
                groupedPayments['NOT_PAYMENT']?.length || 0,
                groupedPayments['PAYMENT_FUTURE']?.length || 0
              ],
              backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
              ],
              borderWidth: 1
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: 'white'
                }
              }
            }
          }}
        />
      </div>
    </div>

    {/* Seção dos cards (seu código existente) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['PAYMENT', 'NOT_PAYMENT', 'PAYMENT_FUTURE'].map((type) => (
        <div key={type} className="bg-gray-900 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-4">
            {type === 'PAYMENT' && 'Pagamentos Realizados'}
            {type === 'NOT_PAYMENT' && 'Pagamentos Não Realizados'}
            {type === 'PAYMENT_FUTURE' && 'Pagamentos Futuros'}
          </h2>
          <p className="text-blue-300 mb-2">
            Total: {groupedPayments[type]?.length ?? 0}
          </p>
          <ul className="space-y-2 text-sm text-gray-300 max-h-40 overflow-y-auto">
            {groupedPayments[type]?.map((p) => (
              <li key={p.id} className="border-b border-gray-700 pb-1">
                <strong>{p.namePayment}</strong>: R$ {Number(p.valuePayment).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
  );
}