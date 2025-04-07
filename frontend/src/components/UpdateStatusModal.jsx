import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateLeadStatus } from '../services/API'; 

const UpdateStatusModal = ({ lead, onClose, refresh }) => {
  const { token } = useContext(AuthContext);
  const [status, setStatus] = useState({
    connected: lead.status?.connected || false,
    response: lead.status?.response || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStatus({ ...status, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/leads/${lead._id}/status`, status, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refresh(); 
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Update Lead Status</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <input
              type="checkbox"
              name="connected"
              checked={status.connected}
              onChange={handleChange}
              className="mr-2"
            />
            Connected
          </label>
          <textarea
            name="response"
            value={status.response}
            onChange={handleChange}
            placeholder="Response"
            className="w-full border rounded p-2"
            rows={3}
            required
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
