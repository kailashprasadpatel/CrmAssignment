import { useEffect, useState, useContext } from 'react';
import API from '../services/API';
import { AuthContext } from '../context/AuthContext';
import UpdateStatusModal from './UpdateStatusModal';

const LeadList = () => {
  const { token } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editedAddress, setEditedAddress] = useState('');

  const fetchLeads = async () => {
    try {
      const { data } = await API.get('/leads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await API.delete(`/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleEdit = (lead) => {
    setEditingLeadId(lead._id);
    setEditedAddress(lead.address);
  };

  const handleSaveEdit = async (id) => {
    try {
      await API.put(
        `/leads/${id}`,
        { address: editedAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingLeadId(null);
      fetchLeads();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleStatusClick = (lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Leads</h2>
      <ul className="space-y-4">
        {leads.map((lead) => (
          <li
            key={lead._id}
            className="border p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div className="flex-1">
              <p><strong>{lead.name}</strong></p>
              <p>{lead.email}</p>
              <p>{lead.phone}</p>

              {editingLeadId === lead._id ? (
                <div className="mt-2">
                  <input
                    type="text"
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <button
                    onClick={() => handleSaveEdit(lead._id)}
                    className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p>Address: {lead.address}</p>
              )}

              <p>Status: {lead.status?.response || 'Not updated'}</p>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <button
                onClick={() => handleStatusClick(lead)}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Update Status
              </button>

              <button
                onClick={() => handleEdit(lead)}
                className="bg-yellow-500 text-white px-4 py-1 rounded"
              >
                Edit Address
              </button>

              <button
                onClick={() => handleDelete(lead._id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedLead && (
        <UpdateStatusModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          refresh={fetchLeads}
        />
      )}
    </div>
  );
};

export default LeadList;
