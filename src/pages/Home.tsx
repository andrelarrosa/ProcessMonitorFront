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
        <div className="bg-gray-100 p-4 rounded shadow">
            <ul>
            {data.namesAndIds.map((process, index) => (
                <li key={index} className="py-2">
                <strong>Nome do Processo:</strong> {process.name} <br />
                <strong>ID do Processo:</strong> {process.id}
                </li>
            ))}
            </ul>
        </div>
        ) : (
        <p>Aguardando atualizações...</p>
        )
      }
    </div>
  );
}

export default Home;