import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/dashboard.css';

export default function EditDeleteClient() {
  const [clients, setClients] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ Names: '', Sex: '', Address: '', Phone: '', Email: '' });

  useEffect(() => {
    refreshClients();
  }, []);

  const refreshClients = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/selectClients', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setClients(res.data))
      .catch(() => toast.error('Failed to fetch clients'));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (client) => {
    setEditId(client._id);   // ✅ MongoDB _id
    setForm({
      Names: client.Names,
      Sex: client.Sex,
      Address: client.Address,
      Phone: client.Phone,
      Email: client.Email
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/updateClient/${editId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
      setEditId(null);
      setForm({ Names: '', Sex: '', Address: '', Phone: '', Email: '' }); // reset form
      refreshClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async id => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`http://localhost:5000/deleteClient/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
      refreshClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ Names: '', Sex: '', Address: '', Phone: '', Email: '' }); // reset form
  };

  return (
    <div>
      <h3>Edit or Delete Clients</h3>

      {editId && (
        <div className="overlay">
          <div className="overlay-content">
            <h4>Editing Client ID: {editId}</h4>
            <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
              {['Names', 'Sex', 'Address', 'Phone', 'Email'].map(field => (
                <input
                  key={field}
                  name={field}
                  placeholder={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit">Update Client</button>
                <button className='btn' type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Names</th><th>Sex</th><th>Address</th><th>Phone</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client._id}>
              {/* <td>{client._id}</td> */}
              <td>{client.Names}</td>
              <td>{client.Sex}</td>
              <td>{client.Address}</td>
              <td>{client.Phone}</td>
              <td>{client.Email}</td>
              <td>
                <button onClick={() => handleEdit(client)}>Edit</button> &nbsp;
                <button className='btn' onClick={() => handleDelete(client._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
