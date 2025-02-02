import { useState } from 'react';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    sendingNumber: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    phoneNumber: '',
    sendingNumber: ''
  });

  const validatePhoneNumber = (number, field) => {
    if (number && !/^\d{11}$/.test(number)) {
      setErrors(prev => ({
        ...prev,
        [field]: 'Phone number must be exactly 11 digits'
      }));
      return false;
    }
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'phoneNumber' || name === 'sendingNumber') {
      // Only allow digits
      if (value && !/^\d*$/.test(value)) {
        return;
      }
      validatePhoneNumber(value, name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isPhoneValid = validatePhoneNumber(formData.phoneNumber, 'phoneNumber');
    const isSendingNumberValid = validatePhoneNumber(formData.sendingNumber, 'sendingNumber');

    if (isPhoneValid && isSendingNumberValid) {
      // Submit form logic here
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Submit a Complaint</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Your Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your 11-digit phone number"
              maxLength={11}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Sending Number</label>
            <input
              type="text"
              name="sendingNumber"
              value={formData.sendingNumber}
              onChange={handleChange}
              placeholder="Enter sending 11-digit phone number"
              maxLength={11}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.sendingNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.sendingNumber && (
              <p className="mt-1 text-red-500 text-sm">{errors.sendingNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f172a] text-white py-2 px-4 rounded-md hover:bg-[#1e293b] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;