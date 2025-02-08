import axios from "axios";
import { useState } from "react";
import { base_url } from "../../config/config";
import { File, Upload, X } from "lucide-react";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    customerPaymentNumber: "",
    companyPaymentNumber: "",
    contactNumber: "",
    subject: "",
    details: "",
    attachments: null,
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null)

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.length < 2 && value.length > 0
          ? "নাম কমপক্ষে ২ অক্ষরের হতে হবে"
          : "";
      case "contactNumber":
        return value && !/^01\d{9}$/.test(value)
          ? "সঠিক ১১-সংখ্যার নম্বর দিন যা 01 দিয়ে শুরু হয়"
          : "";
      case "customerPaymentNumber":
      case "companyPaymentNumber":
        return value && !/^01\d{9}$/.test(value)
          ? "সঠিক ১১-সংখ্যার নম্বর দিন যা 01 দিয়ে শুরু হয়"
          : "";
      case "subject":
        return value.length < 2 && value.length > 0
          ? "বিষয় কমপক্ষে ২ অক্ষরের হতে হবে"
          : "";
      case "details":
        return value.length < 10 && value.length > 0
          ? "বিস্তারিত কমপক্ষে ১০ অক্ষরের হতে হবে"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "contactNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 11);
    }
    if (name === "customerPaymentNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 11);
    }
    if (name === "companyPaymentNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 11);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, newValue) }));
    setError(null)
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Only take the first file

    if (file && file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        attachment: "File must be under 2MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, attachment: "" }));
    setFormData((prev) => ({ ...prev, attachments: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "attachments") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Use FormData to send file uploads
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "attachments" && formData.attachments) {
        formDataToSend.append("attachments", formData.attachments); // Append file
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `${base_url}/complaint`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      console.log("response", response);
      if (response.status === 201) {
        alert("অভিযোগ সফলভাবে জমা দেওয়া হয়েছে!");
        setFormData({
          name: "",
          customerPaymentNumber: "",
          companyPaymentNumber: "",
          contactNumber: "",
          subject: "",
          details: "",
          attachments: null,
        });
      } 
    } catch (error) {
      console.log("error",error?.response?.data?.error)
      alert(error?.response?.data?.error)
      // setErrors((prev) => ({ ...prev, n:  error?.response?.data?.error}));
      setError(error?.response?.data?.error)
    }
  };
  console.log("errorrs",errors)
  const getFilePreview = (file) => {
    if (file?.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Customer Complaint Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">আপনার নাম</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${
                errors?.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1">{errors?.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              কোন নাম্বার থেকে টাকা পাঠিয়েছেন ?
            </label>
            <input
              type="text"
              name="customerPaymentNumber"
              placeholder="01XXXXXXXXX"
              value={formData.customerPaymentNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${
                errors?.customerPaymentNumber
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {errors?.customerPaymentNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.customerPaymentNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              কোন নাম্বারে টাকা পাঠিয়েছেন ?
            </label>
            <input
              type="text"
              name="companyPaymentNumber"
              placeholder="01XXXXXXXXX"
              value={formData.companyPaymentNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${
                errors?.companyPaymentNumber
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {errors?.companyPaymentNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.companyPaymentNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              আপনার সাথে যোগাযোগের নাম্বার দিন ।
            </label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="01XXXXXXXXX"
              className={`w-full p-2 border rounded ${
                errors?.contactNumber ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors?.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.contactNumber}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            কত টাকা পাঠিয়েছেন ?
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              errors?.subject ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors?.subject && (
            <p className="text-red-500 text-sm mt-1">{errors?.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {" "}
            আপনার সমস্যাটি ব্যাখ্যা করুন ।
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={4}
            className={`w-full p-2 border rounded ${
              errors?.details ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors?.details && (
            <p className="text-red-500 text-sm mt-1">{errors?.details}</p>
          )}
        </div>

        <div>
          {formData.attachments ? (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ছবি দেখুন 
              </label>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  {getFilePreview(formData.attachments) ? (
                    <div className="w-20 h-20 relative">
                      <img
                        src={getFilePreview(formData.attachments)}
                        alt={formData.attachments.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  ) : (
                    <File className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {formData.attachments.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(formData.attachments.size / (1024 * 1024)).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setFormData({ ...formData, attachments: null })
                  }
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          ) : (
            <label className="block text-sm font-medium mb-2">
              ফটো আপলোড করুন (2MB পর্যন্ত)
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
        `}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <span className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                    ফটো আপলোড করুন
                    </span>
                    <p className="pl-1">বা টেনে এনে ফেলে দিন</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                  ফটো আপলোড করুন 2 MB পর্যন্ত
                  </p>
                </div>
              </div>
            </label>
          )}

          {errors?.attachments && (
            <p className="text-red-500 text-sm mt-1">{errors?.attachments}</p>
          )}
        </div>
        {
          error && (
            <p className="text-red-500 text-sm mt-1">
              {error}
            </p>
          )
        } 
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          জমা দিন
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
