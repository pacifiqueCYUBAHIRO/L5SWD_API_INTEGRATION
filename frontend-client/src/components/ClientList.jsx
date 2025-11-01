import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/selectClients', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setClients(res.data))
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to fetch clients. Please make sure you are logged in.');
      });
  }, []);

  return (
    <div>
      <h3>Client List</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Names</th><th>Sex</th><th>Address</th><th>Phone</th><th>Email</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.ID}>
              <td>{c.ID}</td><td>{c.Names}</td><td>{c.Sex}</td><td>{c.Address}</td><td>{c.Phone}</td><td>{c.Email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
