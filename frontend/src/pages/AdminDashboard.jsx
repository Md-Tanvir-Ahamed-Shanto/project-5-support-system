/* eslint-disable no-unused-vars */
// AdminDashboard.js
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [highPriorityTickets, setHighPriorityTickets] = useState([]);
  const [lowPriorityTickets, setLowPriorityTickets] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const highResponse = await fetch('http://localhost:5000/api/admin/tickets/high');
      const lowResponse = await fetch('http://localhost:5000/api/admin/tickets/low');
      
      const highData = await highResponse.json();
      const lowData = await lowResponse.json();
      
      setHighPriorityTickets(highData);
      setLowPriorityTickets(lowData);
    } catch (error) {
      setError('Error fetching tickets');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      if (response.ok) {
        setPhoneNumber('');
        setError('');
        setSuccess('User added successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error);
        setSuccess('');
      }
    } catch (error) {
      setError('Error adding user');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Add User</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 11-digit phone number"
              pattern="^\d{11}$"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add User
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">High Priority Tickets</h2>
          <div className="space-y-4">
            {highPriorityTickets.map(ticket => (
              <div key={ticket.id} className="border rounded-md p-4">
                <h3 className="font-bold">{ticket.name}</h3>
                <p className="text-gray-600">Sending Number: {ticket.sending_number}</p>
                <p className="text-gray-600">From Number: {ticket.from_number}</p>
                <p className="text-gray-600">Description: {ticket.description}</p>
                <p className="text-gray-600">Status: {ticket.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Low Priority Tickets</h2>
          <div className="space-y-4">
            {lowPriorityTickets.map(ticket => (
              <div key={ticket.id} className="border rounded-md p-4">
                <h3 className="font-bold">{ticket.name}</h3>
                <p className="text-gray-600">Sending Number: {ticket.sending_number}</p>
                <p className="text-gray-600">From Number: {ticket.from_number}</p>
                <p className="text-gray-600">Description: {ticket.description}</p>
                <p className="text-gray-600">Status: {ticket.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// CustomerDashboard.js
const CustomerDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    sendingNumber: '',
    fromNumber: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess('Ticket submitted successfully');
        setFormData({
          name: '',
          sendingNumber: '',
          fromNumber: '',
          description: ''
        });
        setError('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error);
        setSuccess('');
      }
    } catch (error) {
      setError('Error submitting ticket');
      setSuccess('');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Submit Support Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Sending Number (11 digits)</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="sendingNumber"
              value={formData.sendingNumber}
              onChange={handleChange}
              pattern="^\d{11}$"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">From Number (11 digits)</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="fromNumber"
              value={formData.fromNumber}
              onChange={handleChange}
              pattern="^\d{11}$"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Ticket
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export { AdminDashboard, CustomerDashboard };