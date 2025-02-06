/* eslint-disable react/prop-types */

import {
  TicketIcon,
  CheckCircleIcon,
  ClockIcon,
  TriangleAlert,
  CircleEqual,
  CircleX,
  Ticket,
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Overview = ({
  totalTickets = 0,
  userTickets  = 0,
  solvedTickets = 0,
  pendingTickets = 0,
  matchedTickets = 0,
  unmatchedTickets = 0,
}) => {
  const { setUser } = useContext(UserContext);
  // Calculate percentages
  const solvedPercentage =
    totalTickets > 0 ? Math.round((solvedTickets / totalTickets) * 100) : 0;
  const pendingPercentage =
    totalTickets > 0 ? Math.round((pendingTickets / totalTickets) * 100) : 0;
  const matchedPercentage =
    totalTickets > 0 ? Math.round((matchedTickets / totalTickets) * 100) : 0;
  const unMatchedPercentage =
    totalTickets > 0 ? Math.round((unmatchedTickets / totalTickets) * 100) : 0;
  const repeateativeParcentage =
    totalTickets > 0 ? Math.round(100 * (userTickets  / totalTickets)) : 0;

  const handleLogout = () => {
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800  flex items-center">
          <TicketIcon className="mr-3 text-blue-600" />
          Support Ticket Overview
        </h2>
        <div
          onClick={handleLogout}
          className="p-2 bg-red-400 rounded-lg hover:bg-red-500 hover:cursor-pointer"
        >
          Logout
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tickets */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <TicketIcon className="text-gray-500" />
            <span className="text-3xl font-bold text-gray-800">
              {totalTickets}
            </span>
          </div>
          <h3 className="text-md font-semibold text-gray-600">Total Tickets</h3>
        </div>

        {/* Solved Tickets */}
        <div className="bg-green-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <CheckCircleIcon className="text-green-500" />
            <span className="text-3xl font-bold text-green-800">
              {solvedTickets}{" "}
              <span className="text-sm text-green-600">
                ({solvedPercentage}%)
              </span>
            </span>
          </div>
          <h3 className="text-md font-semibold text-green-600">
            Solved Tickets
          </h3>
        </div>

        {/* Pending Tickets */}
        <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <ClockIcon className="text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-800">
              {pendingTickets}{" "}
              <span className="text-sm text-yellow-600">
                ({pendingPercentage}%)
              </span>
            </span>
          </div>
          <h3 className="text-md font-semibold text-yellow-600">
            Pending Tickets
          </h3>
        </div>
        {/* ticket match */}
        <div className="bg-blue-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <CircleEqual className="text-blue-500" />
            <span className="text-3xl font-bold text-blue-800">
              {matchedTickets}{" "}
              <span className="text-sm text-blue-600">
                ({matchedPercentage}%)
              </span>
            </span>
          </div>
          <h3 className="text-md font-semibold text-blue-600">
            Matched Tickets
          </h3>
        </div>

        {/* ticket unmatch */}
        <div className="bg-red-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <CircleX className="text-red-500" />
            <span className="text-3xl font-bold text-red-800">
              {unmatchedTickets}{" "}
              <span className="text-sm text-red-600">
                ({unMatchedPercentage}%)
              </span>
            </span>
          </div>
          <h3 className="text-md font-semibold text-red-600">
            Unmatched Tickets
          </h3>
        </div>
        {/* ticket repeateativeParcentage */}
        <div className="bg-purple-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <CircleX className="text-purple-500" />
            <span className="text-3xl font-bold text-purple-800">
              {totalTickets / userTickets }{" "}
              <span className="text-sm text-purple-600">
                ({repeateativeParcentage}%)
              </span>
            </span>
          </div>
          <h3 className="text-md font-semibold text-purple-600">
            Pepeateative Reports
          </h3>
        </div>
      </div>

      {/* Ticket Matching Section */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          <Ticket className="inline-block mr-2 text-green-600" />
          Ticket Status
        </h3>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${solvedPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-green-700">
            {solvedTickets} / {totalTickets} Solved
          </span>
        </div>
        <div className="mt-2 text-sm text-green-600">
          Unsolved Tickets: {pendingTickets}
        </div>
      </div>

      {/* Ticket Matching Section */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">
          <TriangleAlert className="inline-block mr-2 text-blue-600" />
          Ticket Matching Status
        </h3>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${matchedPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-blue-700">
            {matchedTickets} / {totalTickets} Matched
          </span>
        </div>
        <div className="mt-2 text-sm text-blue-600">
          Unmatched Tickets: {unmatchedTickets}
        </div>
      </div>
    </div>
  );
};

export default Overview;
