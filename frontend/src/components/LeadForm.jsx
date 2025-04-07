import { useState, useContext } from 'react';
import API from '../services/API';
import { AuthContext } from '../context/AuthContext';

const LeadForm = ({ onLeadCreated }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/leads', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onLeadCreated();
      setFormData({ name: '', email: '', phone: '', address: '' });
    } catch (error) {
      console.error('Failed to create lead:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow space-y-2">
      <input type="text" name="name" placeholder="Name" className="w-full p-2 border rounded" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={handleChange} required />
      <input type="text" name="phone" placeholder="Phone" className="w-full p-2 border rounded" value={formData.phone} onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" className="w-full p-2 border rounded" value={formData.address} onChange={handleChange} required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Lead</button>
    </form>
  );
};

export default LeadForm;
