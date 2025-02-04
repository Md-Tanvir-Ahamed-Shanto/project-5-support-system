import { useState } from "react";

const TicketManagement = () => {
  const [activeTab, setActiveTab] = useState("high");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    {
      id: 1,
      customerName: "John Doe",
      customerPaymentNum: "CPY001",
      ourPaymentNum: "OPN001",
      subject: "Payment Issue",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      customerPaymentNum: "CPY002",
      ourPaymentNum: "OPN002",
      subject: "Refund Request",
      status: "solved",
      priority: "low",
    },
    {
        id: 3,
        customerName: "John sdf",
        customerPaymentNum: "sdf",
        ourPaymentNum: "OPN001",
        subject: "Payment Issue",
        status: "solved",
        priority: "high",
      },
      {
        id: 4,
        customerName: "Jane sdfsd",
        customerPaymentNum: "sdffs",
        ourPaymentNum: "OPN002",
        subject: "Refund Request",
        status: "pending",
        priority: "low",
      },
  ];

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedTicket) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg">
      <div className="bg-gray-100 w-full">
        <div className="flex items-center justify-center w-full p-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Ticket Management
          </h2>
        </div>
      </div>
      <div className="flex justify-center items-center mt-3 px-8 w-full gap-4 mb-6">
        <button
          onClick={() => setActiveTab("high")}
          className={` w-full py-2 rounded-lg ${
            activeTab === "high"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          High Priority
        </button>
        <button
          onClick={() => setActiveTab("low")}
          className={`w-full py-2 rounded-lg ${
            activeTab === "low"
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
            {tickets
              .filter((ticket) => ticket.priority === activeTab)
              .map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{ticket.id}</td>
                  <td className="p-2 border">{ticket.customerName}</td>
                  <td className="p-2 border">{ticket.customerPaymentNum}</td>
                  <td className="p-2 border">{ticket.ourPaymentNum}</td>
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
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Ticket Details</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold">Customer Name:</p>
                <p>{selectedTicket.customerName}</p>
              </div>
              <div>
                <p className="font-semibold">Customer Payment Number:</p>
                <p>{selectedTicket.customerPaymentNum}</p>
              </div>
              <div>
                <p className="font-semibold">Our Payment Number:</p>
                <p>{selectedTicket.ourPaymentNum}</p>
              </div>
              <div>
                <p className="font-semibold">Subject:</p>
                <p>{selectedTicket.subject}</p>
              </div>
              <div>
                <p className="font-semibold">Current Status:</p>
                <p>{selectedTicket.status}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleStatusChange("solved")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Mark as Solved
              </button>
              <button
                onClick={() => handleStatusChange("pending")}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Mark as Pending
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
