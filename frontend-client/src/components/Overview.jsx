import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import '../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Overview() {
  const [clients, setClients] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [addressMap, setAddressMap] = useState({});
  const [repeatedAddresses, setRepeatedAddresses] = useState([]);

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

        const map = {};
        data.forEach(c => {
          const addr = c.Address.trim().toLowerCase();
          map[addr] = (map[addr] || 0) + 1;
        });

        const repeated = Object.entries(map)
          .filter(([_, count]) => count > 1)
          .sort((a, b) => b[1] - a[1]);

        setAddressMap(map);
        setRepeatedAddresses(repeated);
      })
      .catch(() => console.error('Failed to fetch client data'));
  }, []);

  const genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Client Count',
        data: [maleCount, femaleCount],
        backgroundColor: ['#3498db', '#e91e63'],
        borderRadius: 5,
        barThickness: 40
      }
    ]
  };

  const allAddressChartData = {
    labels: Object.keys(addressMap),
    datasets: [
      {
        label: 'All Address Frequency',
        data: Object.values(addressMap),
        backgroundColor: '#f39c12',
        borderRadius: 5,
        barThickness: 30
      }
    ]
  };

  const repeatedAddressChartData = {
    labels: repeatedAddresses.map(([addr]) => addr),
    datasets: [
      {
        label: 'Repeated Address Frequency',
        data: repeatedAddresses.map(([_, count]) => count),
        backgroundColor: '#2ecc71',
        borderRadius: 5,
        barThickness: 30
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#ffffff' },
        grid: { color: '#444' }
      }
    }
  };

  return (
    <div>
  <h4 style={{ marginTop: '40px', textAlign: 'center' }}>All Clients</h4>
      <table>
        <thead>
          <tr>
            <th>Names</th><th>Sex</th><th>Address</th><th>Phone</th><th>Email</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.ID}>
            
              <td>{client.Names}</td>
              <td>{client.Sex}</td>
              <td>{client.Address}</td>
              <td>{client.Phone}</td>
              <td>{client.Email}</td>
            </tr>
          ))}
        </tbody>
      </table>     

      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Client Gender Overview</h3>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <p>Total Clients: {clients.length}</p>
        <p>
          Male: {maleCount} | Female: {femaleCount} | Unique Addresses: {Object.keys(addressMap).length} | Repeated: {repeatedAddresses.length}
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '500px', height: '300px', margin: '0 auto' }}>
        <Bar data={genderChartData} options={chartOptions} />
      </div>

        {Object.keys(addressMap).length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>All Address Frequencies</h4>
          <div style={{ width: '100%', maxWidth: '600px', height: '300px', margin: '0 auto' }}>
            <Bar data={allAddressChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {repeatedAddresses.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Repeated Addresses</h4>
          <div style={{ width: '100%', maxWidth: '600px', height: '300px', margin: '0 auto' }}>
            <Bar data={repeatedAddressChartData} options={chartOptions} />
          </div>
        </div>
      )}

    </div>
  );
}
