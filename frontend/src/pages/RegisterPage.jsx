import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'telecaller' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
          <option value="telecaller">Telecaller</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;