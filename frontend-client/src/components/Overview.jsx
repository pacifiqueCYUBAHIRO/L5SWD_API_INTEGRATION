import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Overview() {
  const [clients, setClients] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/selectClients', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        const data = res.data;
        setClients(data);

        const males = data.filter(c => c.Sex.toLowerCase() === 'male').length;
        const females = data.filter(c => c.Sex.toLowerCase() === 'female').length;
        setMaleCount(males);
        setFemaleCount(females);
      })
      .catch(() => console.error('Failed to fetch client data'));
  }, []);

  const chartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ['#3498db', '#e91e63'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: { size: 14 }
        }
      }
    }
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Client Gender Overview</h3>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <p>Total Clients: {clients.length}</p>
        <p>Male: {maleCount} | Female: {femaleCount}</p>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', height: '300px', margin: '0 auto' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>

      <h4 style={{ marginTop: '40px', textAlign: 'center' }}>All Clients</h4>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Names</th><th>Sex</th><th>Address</th><th>Phone</th><th>Email</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.ID}>
              <td>{client.ID}</td>
              <td>{client.Names}</td>
              <td>{client.Sex}</td>
              <td>{client.Address}</td>
              <td>{client.Phone}</td>
              <td>{client.Email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
