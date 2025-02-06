/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  TriangleAlert,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  PencilIcon,
  Phone,
} from "lucide-react";
import axios from "axios";
import { base_url } from "../../config/config";

const Number = () => {
  const [totalNumbers, setTotalNumbers] = useState(500);
  const [activeNumbers, setActiveNumbers] = useState(350);
  const [limitedNumbers, setLimitedNumbers] = useState(100);
  const [expiredNumbers, setExpiredNumbers] = useState(50);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [isEdit, setIsEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNumber, setNewNumber] = useState({
    serialNumber: "",
    number: "",
    status: "active",
  });

  const [Numbers, setNumbers] = useState([]);

  const handleAddNumber = () => {
    // Logic to open a modal and create a new Numbers
    setShowModal(true);
  };
  const handleSubmit = async () => {
    if (isEdit) {
      // Logic to update the selected Numbers
      try {
        const response = await axios.put(
          `${base_url}/admin/user/${isEdit}`,
          newNumber
        );
        const data = response.data;
        console.log("data: ", data);
        if (response.status === 200) {
          alert(data.message);
          handleFetchUsers();
        }
        setShowModal(false);
        setNewNumber({ serialNumber: "", number: "", status: "active" });
        setError(null);
      } catch (error) {
        console.log("error: ", error);
        setError(error?.response?.data?.error);
      }
    } else {
      try {
        const response = await axios.post(`${base_url}/admin/user`, newNumber);
        const data = response.data;
        console.log("data: ", data);
        if (response.status === 201) {
          alert(data.message);
          handleFetchUsers();
        }
        setShowModal(false);
        setNewNumber({ serialNumber: "", number: "", status: "active" });
        setError(null);
      } catch (error) {
        console.log("error: ", error);
        setError(error?.response?.data?.error);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterStatus = (status) => {
    setFilteredStatus(status);
  };

  const handleEditNumber = (Number) => {
    setNewNumber(Number);
    setIsEdit(Number?.id);
    setShowModal(true);
    // Logic to open a modal and edit the selected Numbers
  };

  const handleDeleteNumber = (NumbersId) => {
    // Logic to delete the selected Numbers
  };

  const handleCloseModel = () => {
    setError(null);
    setShowModal(false);
    setIsEdit(null);
    setNewNumber({ serialNumber: "", number: "", status: "active" });
  };

  const filteredNumbers = Numbers.filter((Numbers) => {
    if (filteredStatus === "all") return true;
    return Numbers.status === filteredStatus;
  }).filter((Numbers) => {
    return (
      Numbers.serialNumber.includes(searchQuery) ||
      Numbers.number.includes(searchQuery)
    );
  });

  const handleFetchUsers = async () => {
    try {
      const response = await axios.get(`${base_url}/admin/users`);
      const data = response.data;
      setNumbers(data);
      setTotalNumbers(data.length);
      setActiveNumbers(
        data.filter((number) => number.status === "active").length
      );
      setLimitedNumbers(
        data.filter((number) => number.status === "limited").length
      );
      setExpiredNumbers(
        data.filter((number) => number.status === "expired").length
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-full mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Phone className="mr-3 text-blue-600" />
        Numbers Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <Phone className="text-gray-500" />
            <span className="text-3xl font-bold text-gray-800">
              {totalNumbers}
            </span>
          </div>
          <h3 className="text-md font-semibold text-gray-600">Total Numbers</h3>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <CheckCircleIcon className="text-green-500" />
            <span className="text-3xl font-bold text-green-800">
              {activeNumbers}
            </span>
          </div>
          <h3 className="text-md font-semibold text-green-600">
            Active Numbers
          </h3>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <ClockIcon className="text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-800">
              {limitedNumbers}
            </span>
          </div>
          <h3 className="text-md font-semibold text-yellow-600">
            Limited Numbers
          </h3>
        </div>

        <div className="bg-red-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <TriangleAlert className="text-red-500" />
            <span className="text-3xl font-bold text-red-800">
              {expiredNumbers}
            </span>
          </div>
          <h3 className="text-md font-semibold text-red-600">
            Expired Numbers
          </h3>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search Numbers..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddNumber}
          >
            <PlusIcon className="w-5 h-5 inline-block mr-2" />
            Add New Numbers
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="mr-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              filteredStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => handleFilterStatus("all")}
          >
            All
          </button>
        </div>
        <div className="mr-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              filteredStatus === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => handleFilterStatus("active")}
          >
            Active
          </button>
        </div>
        <div className="mr-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              filteredStatus === "limited"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => handleFilterStatus("limited")}
          >
            Limited
          </button>
        </div>
        <div>
          <button
            className={`px-4 py-2 rounded-lg ${
              filteredStatus === "expired"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => handleFilterStatus("expired")}
          >
            Expired
          </button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-6 text-left text-gray-600 font-medium">
              ID
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-medium">
              Serial Number
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-medium">
              Number
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-medium">
              Status
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredNumbers.map((Numbers) => (
            <tr key={Numbers.id} className="border-b">
              <td className="py-4 px-6 text-gray-800">{Numbers.id}</td>
              <td className="py-4 px-6 text-gray-800">
                {Numbers.serialNumber}
              </td>
              <td className="py-4 px-6 text-gray-800">{Numbers.number}</td>
              <td className="py-4 px-6 text-gray-800">
                <span
                  className={`px-2 py-1 rounded-full text-white text-sm ${
                    Numbers.status === "active"
                      ? "bg-green-600"
                      : Numbers.status === "limited"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  {Numbers.status}
                </span>
              </td>
              <td className="py-4 px-6 text-gray-800 flex items-center space-x-4">
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={() => handleEditNumber(Numbers)}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteNumber(Numbers.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Number" : "Add New Number"}
            </h3>
            <input
              type="text"
              placeholder="Serial Number"
              className="border p-2 w-full mb-2"
              value={newNumber.serialNumber}
              onChange={(e) =>
                setNewNumber({ ...newNumber, serialNumber: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Number"
              className="border p-2 w-full mb-2"
              value={newNumber.number}
              onChange={(e) =>
                setNewNumber({ ...newNumber, number: e.target.value })
              }
            />
            <select
              className="border p-2 w-full mb-2"
              value={newNumber.status}
              onChange={(e) =>
                setNewNumber({ ...newNumber, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="limited">Limited</option>
              <option value="expired">Expired</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCloseModel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Number;
