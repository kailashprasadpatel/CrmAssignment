// crm-frontend/src/pages/TelecallerDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TelecallerDashboard = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editId, setEditId] = useState(null);
  const [editLead, setEditLead] = useState({ name: '', email: '', phone: '', address: '' });
  const [statusData, setStatusData] = useState({});

  const fetchLeads = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/leads', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to fetch leads');
    }
  }, [user.token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditLead({ ...editLead, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/leads', form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setForm({ name: '', email: '', phone: '', address: '' });
      fetchLeads();
    } catch (err) {
      console.error('Failed to add lead');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchLeads();
    } catch (err) {
      console.error('Failed to delete lead');
    }
  };

  const startEdit = (lead) => {
    setEditId(lead._id);
    setEditLead({ name: lead.name, email: lead.email, phone: lead.phone, address: lead.address });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/leads/${editId}`,
        editLead,
        { headers: { Authorization: `Bearer ${user.token}` } });
      setEditId(null);
      setEditLead({ name: '', email: '', phone: '', address: '' });
      fetchLeads();
    } catch (err) {
      console.error('Failed to update lead');
    }
  };

  const updateStatus = async (id) => {
 
    const { status, response } = statusData[id] || {};
    try {
      await axios.patch(
        `http://localhost:8000/api/leads/${id}/status`, // ✅ PATCH instead of PUT
        { connected: status, response },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      fetchLeads();
    } catch (err) {
      console.error('Failed to update status:', err.response?.data || err.message);
    }
  };
  const handleStatusChange = (id, field, value) => {
    let parsedValue = value;
  
    if (field === "connected") {
      // Convert string to Boolean
      parsedValue = value === "connected";
    }
  
    setStatusData({
      ...statusData,
      [id]: { ...statusData[id], [field]: parsedValue },
    });
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Telecaller Dashboard</h2>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md">Logout</button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-xl shadow">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200" required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200" required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200" required />
        <button type="submit" className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow">Add Lead</button>
      </form>

      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Leads List</h3>
      <ul className="space-y-6">
        {leads.map((lead) => (
          <li key={lead._id} className="p-6 bg-white rounded-xl shadow space-y-4">
            {editId === lead._id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="name" value={editLead.name} onChange={handleEditChange} className="p-2 border rounded" />
                <input name="email" value={editLead.email} onChange={handleEditChange} className="p-2 border rounded" />
                <input name="phone" value={editLead.phone} onChange={handleEditChange} className="p-2 border rounded" />
                <input name="address" value={editLead.address} onChange={handleEditChange} className="p-2 border rounded" />
                <button onClick={saveEdit} className="col-span-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            ) : (
              <>
                <p className="text-lg font-bold">{lead.name} <span className="font-normal text-sm text-gray-500">({lead.email}, {lead.phone})</span></p>
                <p className="text-gray-600">Address: {lead.address}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={() => startEdit(lead)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(lead._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </>
            )}

            <div className="mt-4">
              <label className="font-medium text-gray-700">Status:</label>
              <select onChange={(e) => handleStatusChange(lead._id, 'status', e.target.value)} value={statusData[lead._id]?.status || ''} className="ml-2 p-2 border rounded">
                <option value="">Select Status</option>
                <option value="connected">Connected</option>
                <option value="not_connected">Not Connected</option>
              </select>

              {statusData[lead._id]?.status === 'connected' && (
                <select onChange={(e) => handleStatusChange(lead._id, 'response', e.target.value)} value={statusData[lead._id]?.response || ''} className="ml-2 p-2 border rounded">
                  <option value="">Select Response</option>
                  <option value="discussed">Discussed</option>
                  <option value="callback">Callback</option>
                  <option value="interested">Interested</option>
                </select>
              )}

              {statusData[lead._id]?.status === 'not_connected' && (
                <select onChange={(e) => handleStatusChange(lead._id, 'response', e.target.value)} value={statusData[lead._id]?.response || ''} className="ml-2 p-2 border rounded">
                  <option value="">Select Response</option>
                  <option value="busy">Busy</option>
                  <option value="rnr">RNR (Ring No Response)</option>
                  <option value="switched_off">Switched Off</option>
                </select>
              )}

              <button onClick={() => updateStatus(lead._id)} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Save</button>
            </div>

            <p className="text-sm text-gray-500 mt-2">Current Status: <span className="font-semibold">{lead.status?.status || 'Pending'}</span> {lead.status?.response && `- ${lead.status.response}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TelecallerDashboard;
