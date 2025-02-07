import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './App.css';

function App() {
  const [stats, setStats] = useState([]);
  const [logs, setLogs] = useState<Array<{ id: string, status: string; created_at: string }>>([]);

  useEffect(() => {
    fetch('/api/email/logs/stats')
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch('/api/email/logs/latest?limit=10')
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📊 Email Dashboard</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg shadow">
            <h2 className="text-lg font-semibold">Статистика отправки</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 border rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              Последние отправленные email
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Статус</th>
                  <th className="border p-2">Дата</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="border">
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">{log.status}</td>
                    <td className="p-2">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
