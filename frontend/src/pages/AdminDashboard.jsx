import React, { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- FILTER LOGIC ---
  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const dateStr = new Date(log.createdAt).toLocaleDateString();
    return (
      log.adminName.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.targetUserEmail.toLowerCase().includes(term) ||
      dateStr.includes(term)
    );
  });

  // --- CSV EXPORT LOGIC ---
  const downloadCSV = () => {
    const dataToExport = activeTab === "users" ? filteredUsers : filteredLogs;
    if (dataToExport.length === 0) return toast.error("No data to export");

    // Define headers based on tab
    const headers =
      activeTab === "users"
        ? [
            "First Name",
            "Last Name",
            "Email",
            "Role",
            "Verified",
            "Pro Tier",
            "Banned",
          ]
        : ["Admin Name", "Action", "Target User", "Date/Time"];

    // Format rows
    const rows = dataToExport.map((item) => {
      if (activeTab === "users") {
        return [
          item.firstName,
          item.lastName,
          item.email,
          item.role,
          item.artisanProfile?.isVerified ? "Yes" : "No",
          item.artisanProfile?.subscriptionTier === "pro" ? "Yes" : "No",
          item.isBanned ? "Yes" : "No",
        ];
      }
      return [
        item.adminName,
        item.action,
        item.targetUserEmail,
        new Date(item.createdAt).toLocaleString(),
      ];
    });

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTab.replace(" ", "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported!");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } else {
        const res = await API.get("/admin/logs");
        setLogs(res.data);
      }
    } catch (err) {
      toast.error("Failed to load data. Are you an admin?");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, actionType) => {
    try {
      await API.put(`/admin/users/${userId}/${actionType}`);
      toast.success("Action completed and logged!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Action failed");
    }
  };

  if (loading && users.length === 0)
    return <div className="p-20 text-center">Loading Admin Panel...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-8">
        Platform Administration
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {["users", "audit logs"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm("");
            }}
            className={`py-4 px-6 text-sm font-bold uppercase tracking-wider ${
              activeTab === tab
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SEARCH & ACTION BAR */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder={
              activeTab === "users"
                ? "Search email or name..."
                : "Search admin, action, or date..."
            }
            className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-4 top-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <button
          onClick={downloadCSV}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          DOWNLOAD CSV
        </button>
      </div>

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className={`border-b border-gray-100 ${u.isBanned ? "bg-red-50 opacity-75" : ""}`}
                >
                  <td className="p-4">
                    <p className="font-bold text-gray-900">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.role === "artisan" && (
                      <div className="flex flex-col gap-1 text-xs">
                        <span
                          className={
                            u.artisanProfile?.isVerified
                              ? "text-green-600 font-bold"
                              : "text-gray-400"
                          }
                        >
                          {u.artisanProfile?.isVerified
                            ? "✓ Verified"
                            : "Unverified"}
                        </span>
                        <span
                          className={
                            u.artisanProfile?.subscriptionTier === "pro"
                              ? "text-blue-600 font-bold"
                              : "text-gray-400"
                          }
                        >
                          {u.artisanProfile?.subscriptionTier === "pro"
                            ? "PRO TIER"
                            : "Free Tier"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {u.role === "artisan" && (
                      <>
                        <button
                          onClick={() => handleAction(u._id, "verify")}
                          className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded hover:bg-green-100"
                        >
                          Toggle Verify
                        </button>
                        <button
                          onClick={() => handleAction(u._id, "tier")}
                          className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100"
                        >
                          Toggle Pro
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleAction(u._id, "ban")}
                      className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded hover:bg-red-100"
                    >
                      {u.isBanned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LOGS TAB */}
      {activeTab === "audit logs" && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-black uppercase text-gray-500 mb-4 flex justify-between">
            Immutable Activity Stream
            <span className="text-[10px] lowercase font-normal opacity-70">
              Showing {filteredLogs.length} logs
            </span>
          </h2>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log._id}
                className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-bold">{log.adminName}</span> performed{" "}
                    <span
                      className={`font-black font-mono px-2 py-0.5 rounded text-[11px] ${log.action.includes("BAN") ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-800"}`}
                    >
                      {log.action}
                    </span>{" "}
                    on <span className="font-bold">{log.targetUserEmail}</span>
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-xs text-gray-400 font-bold">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-[10px] text-gray-300">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="p-10 text-center text-gray-400 italic">
                No activity logs matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
