import { useState } from 'react';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    customerPaymentNumber: '',
    companyPaymentNumber: '',
    contactNumber: '',
    subject: '',
    details: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 2 && value.length > 0 ? 'Name must be at least 2 characters' : '';
      case 'contactNumber':
        return value && !/^01\d{9}$/.test(value) ? 'Enter valid 11-digit number starting with 01' : '';
      case 'customerPaymentNumber':
      case 'companyPaymentNumber':
        return value && !/^01\d{9}$/.test(value) ? 'Enter valid 11-digit number starting with 01' : '';
      case 'subject':
        return value.length < 3 && value.length > 0 ? 'Subject must be at least 3 characters' : '';
      case 'details':
        return value.length < 10 && value.length > 0 ? 'Details must be at least 10 characters' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'contactNumber') {
      newValue = value.replace(/\D/g, '').slice(0, 11);
    }
    if (name === 'customerPaymentNumber') {
      newValue = value.replace(/\D/g, '').slice(0, 11);
    }
    if (name === 'companyPaymentNumber') {
      newValue = value.replace(/\D/g, '').slice(0, 11);
    }
    
    setFormData(prev => ({...prev, [name]: newValue}));
    setErrors(prev => ({...prev, [name]: validateField(name, newValue)}));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({...prev, [name]: validateField(name, value)}));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 2 * 1024 * 1024);
    
    if (validFiles.length < files.length) {
      setErrors(prev => ({...prev, attachments: 'Files must be under 2MB'}));
    } else {
      setErrors(prev => ({...prev, attachments: ''}));
    }

    setFormData(prev => ({...prev, attachments: validFiles}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'attachments') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  // Rest of the component remains the same...
  // (Include the same JSX structure as before)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Complaint Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Customer Payment Number</label>
            <input
              type="text"
              name="customerPaymentNumber"
              placeholder="01XXXXXXXXX"
              value={formData.customerPaymentNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${errors.customerPaymentNumber ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.customerPaymentNumber && <p className="text-red-500 text-sm mt-1">{errors.customerPaymentNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company Payment Number</label>
            <input
              type="text"
              name="companyPaymentNumber"
              placeholder="01XXXXXXXXX"
              value={formData.companyPaymentNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${errors.companyPaymentNumber ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.companyPaymentNumber && <p className="text-red-500 text-sm mt-1">{errors.companyPaymentNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="01XXXXXXXXX"
              className={`w-full p-2 border rounded ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Complaint Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={4}
            className={`w-full p-2 border rounded ${errors.details ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Attachments (Max 2MB)
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </label>
          {errors.attachments && <p className="text-red-500 text-sm mt-1">{errors.attachments}</p>}
          {formData.attachments.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
              {formData.attachments.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;