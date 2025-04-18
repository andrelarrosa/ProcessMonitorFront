import { useEffect, useState } from 'react';
import connection from '../services/socket';

type ProcessData = {
    namesAndIds: { name: string, id: string }[];
}

function Home() {
  const [data, setData] = useState<ProcessData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startConnection = async () => {
      try {
        if (connection.state === 'Disconnected') {
          await connection.start();
          console.log('✅ Conectado ao SignalR');
        }

        connection.on('process:update', (processo: ProcessData) => {
          console.log('📦 Dados recebidos:', processo);
          if (isMounted) setData(processo);
        });
      } catch (err) {
        console.error('❌ Erro ao conectar ao SignalR:', err);
        setTimeout(startConnection, 5000); // tenta reconectar depois de 5s
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      connection.off('process:update');
      if (connection.state === 'Connected') {
        connection.stop();
      }
    };
  }, []);

  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Status do Processo</h1>
    {data && data.namesAndIds ? (
      <div className="overflow-x-auto bg-gray-100 p-4 rounded shadow">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nome do Processo</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID do Processo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.namesAndIds.map((process, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{process.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{process.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>Aguardando atualizações...</p>
    )}
  </div>
  
  );
}

export default Home;