import { useEffect, useState } from "react";
import { api_url, base_url } from "../../config/config";
import axios from "axios";

const TicketManagement = () => {
  const [activeTab, setActiveTab] = useState("High");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedTicket) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    try {
      let response =await axios.delete(`${base_url}/admin/complaints/cleanup`);
      if(response.status === 200){
        alert(response.data.message);
      }
      fetchData();
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchData = async () => {
    try {
      let response = await axios.get(`${base_url}/admin/complaints`);
      setTickets(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="p-6 bg-white shadow-lg">
      <div className="bg-gray-100 w-full">
        <div className="flex relative items-center justify-center w-full p-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Ticket Management
          </h2>
          <button onClick={handleDelete} className="absolute right-0 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Delete Old Data</button>
        </div>
      </div>
      <div className="w-full mt-3 px-8 ">
      <button
          onClick={() => setActiveTab("All")}
          className={` w-full py-2 rounded-lg ${
            activeTab === "All"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          All
        </button>
      </div>
      <div className="flex justify-center items-center mt-3 px-8 w-full gap-4 mb-6">
        <button
          onClick={() => setActiveTab("High")}
          className={` w-full py-2 rounded-lg ${
            activeTab === "High"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          High Priority
        </button>
        <button
          onClick={() => setActiveTab("Low")}
          className={`w-full py-2 rounded-lg ${
            activeTab === "Low"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Low Priority
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">ID</th>
              <th className="p-2 border text-left">Customer Name</th>
              <th className="p-2 border text-left">Customer Payment</th>
              <th className="p-2 border text-left">Our Payment</th>
              <th className="p-2 border text-left">Subject</th>
              <th className="p-2 border text-left">Status</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              activeTab === "All" ? (
                tickets.map((ticket) => (
                  <tr className={ticket.priority === "High" ? "bg-red-100" : ""} key={ticket.id}>
                    <td className="p-2 border">{ticket.id}</td>
                    <td className="p-2 border">{ticket.name}</td>
                    <td className="p-2 border">{ticket.customerPaymentNumber}</td>
                    <td className="p-2 border">{ticket.companyPaymentNumber}</td>
                    <td className="p-2 border">{ticket.subject}</td>
                    <td className="p-2 border">{ticket.status}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleView(ticket)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                tickets
                  .filter((ticket) => ticket.priority === activeTab)
                  .map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{ticket.id}</td>
                      <td className="p-2 border">{ticket.name}</td>
                      <td className="p-2 border">{ticket.customerPaymentNumber}</td>
                      <td className="p-2 border">{ticket.companyPaymentNumber}</td>
                      <td className="p-2 border">{ticket.subject}</td>
                      <td className="p-2 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            ticket.status === "solved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleView(ticket)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
              )
            }
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex  h-full items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full overflow-y-scroll h-full max-w-6xl">
          <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold">Customer Name:</p>
              <p>{selectedTicket.name}</p>
            </div>
            <div>
              <p className="font-semibold">Customer Payment Number:</p>
              <p>{selectedTicket.customerPaymentNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Company Payment Number:</p>
              <p>{selectedTicket.companyPaymentNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Contact Number:</p>
              <p>{selectedTicket.contactNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Subject:</p>
              <p>{selectedTicket.subject}</p>
            </div>
            <div>
              <p className="font-semibold">Priority:</p>
              <p>{selectedTicket.priority}</p>
            </div>
            <div>
              <p className="font-semibold">Created At:</p>
              <p>{formatDate(selectedTicket.createdAt)}</p>
            </div>
            <div>
              <p className="font-semibold">Current Status:</p>
              <p className="capitalize">{selectedTicket.status}</p>
            </div>
            <div className="col-span-2">
              <p className="font-semibold">Details:</p>
              <p>{selectedTicket.details}</p>
            </div>
            {selectedTicket.attachments && (
              <div className="col-span-2">
                <p className="font-semibold">Attachments:</p>
                <img src={`${api_url}/uploads/${selectedTicket.attachments}`} alt="attachment" />
                <div className="w-full flex justify-center items-center gap-5 mt-2">

                <p>{selectedTicket.attachments}</p>
                <a className="underline text-blue-500 hover:text-blue-600" href={`${api_url}/uploads/${selectedTicket.attachments}`} target="_blank">Dowload / View</a>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4">
          <button
              onClick={() => handleStatusChange("pending")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Ticket
            </button>
            <button
              onClick={() => handleStatusChange("pending")}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Mark as Pending
            </button>
            <button
              onClick={() => handleStatusChange("solved")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Mark as Solved
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default TicketManagement;
