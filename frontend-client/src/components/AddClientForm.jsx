import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddClientForm() {
  const [form, setForm] = useState({
    Names: '',
    Sex: '',
    Address: '',
    Phone: '',
    Email: ''
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/addClient', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(`✅ ${res.data.message}`);
      setForm({ Names: '', Sex: '', Address: '', Phone: '', Email: '' }); // ✅ reset form
    } catch (err) {
      console.error('Add client error:', err);
      toast.error(`❌ ${err.response?.data?.message || 'Error occurred'}`);
    }
  };

  return (
    <div>
      <h3>Add New Client</h3>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Add Client</button>
      </form>
    </div>
  );
}
