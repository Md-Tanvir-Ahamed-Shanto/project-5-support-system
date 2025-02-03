import { useState } from "react";
import ComplaintForm from "../customers/ComplainForm";
import Overview from "./Overview";
import Number from "./Number";

const AdminDashboard = () => {
  const [show, setShow] = useState("overview");

  return (
    <div className="min-h-screen w-full flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 h-screen bg-gray-800 text-white flex flex-col">
        <div className="p-4 flex items-center space-x-2 border-b border-gray-700">
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          <span className="text-lg">Admin Panel</span>
        </div>

        <nav className="p-4 space-y-2 flex-grow">
          {[
            { key: "overview", label: "Overview" },
            { key: "number", label: "Number" },
            { key: "online", label: "Online Data" },
            { key: "match", label: "Match Data" },
            { key: "payment", label: "Agent Edit Request" },
            { key: "link", label: "Generate Link" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setShow(item.key)}
              className={`block w-full px-4 py-2 rounded ${
                show === item.key ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        {show === "overview" && (
          <Overview
            totalTickets={500}
            solvedTickets={350}
            pendingTickets={150}
            matchedTickets={400}
            unmatchedTickets={100}
          />
        )}
        {
          show === "number" && (
          <Number />
              
              )
        }
        {["online", "match", "payment", "link"].includes(show) && (
          <ComplaintForm />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
