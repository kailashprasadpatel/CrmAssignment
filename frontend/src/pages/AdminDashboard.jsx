import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [telecallers, setTelecallers] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchTelecallers = async () => {
      const res = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTelecallers(res.data);
    };
    fetchTelecallers();
  }, [user]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-1 rounded">Logout</button>
      </div>
      <h3 className="text-xl mb-2">Telecallers List</h3>
      <ul className="space-y-2">
        {telecallers.map(tc => (
          <li key={tc._id} className="p-3 border rounded shadow">{tc.name} - {tc.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;