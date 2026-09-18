import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  UserPlus,
  Phone,
  Mail,
} from "lucide-react";
import { useNotifications } from "../context/useNotifications";
import { getUserItem, setUserItem } from "../utils/userStorage";

const notifyDashboard = () => {
  window.dispatchEvent(new Event("crmDataUpdated"));
};

const Leads = () => {
  const { addNotification } = useNotifications();

  const [leads, setLeads] = useState(() => getUserItem("crmLeads", []));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    status: "New",
    priority: "Medium",
    assignedTo: "Surya",
  });

  useEffect(() => {
    setUserItem("crmLeads", leads);
    notifyDashboard();
  }, [leads]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddLead = () => {
    setEditingLead(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "Website",
      status: "New",
      priority: "Medium",
      assignedTo: "Surya",
    });
    setShowForm(true);
  };

  const openEditLead = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      company: lead?.company || "",
      source: lead?.source || "Website",
      status: lead?.status || "New",
      priority: lead?.priority || "Medium",
      assignedTo: lead?.assignedTo || "Surya",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.email?.trim()) {
      alert("Please fill required fields (Name and Email).");
      return;
    }

    if (editingLead) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === editingLead.id ? { ...lead, ...formData } : lead,
        ),
      );
      addNotification("Lead", "updated", formData.name);
    } else {
      const newLead = {
        ...formData,
        id:
          leads.length > 0
            ? Math.max(...leads.map((l) => Number(l.id) || 0)) + 1
            : 1,
      };

      setLeads((prev) => [...prev, newLead]);
      addNotification("Lead", "created", newLead.name);
    }

    setShowForm(false);
    setEditingLead(null);
  };

  const handleStatusChange = (id, newStatus) => {
    const leadToUpdate = leads.find((l) => l.id === id);

    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
    );

    addNotification(
      "Lead",
      "updated",
      `${leadToUpdate?.name || "Lead"} marked as ${newStatus}`,
    );
  };

  const handleDelete = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    addNotification("Lead", "deleted", leadToDelete?.name || "Lead removed");
  };

  const filteredLeads = leads.filter((lead) => {
    const searchText = (search || "").toLowerCase();
    const name = (lead?.name || "").toLowerCase();
    const email = (lead?.email || "").toLowerCase();
    const company = (lead?.company || "").toLowerCase();

    const matchesSearch =
      name.includes(searchText) ||
      email.includes(searchText) ||
      company.includes(searchText);

    const matchesStatus =
      statusFilter === "All" || lead?.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || lead?.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusStyle = (status) => {
    const styles = {
      New: "bg-blue-100 text-blue-700",
      Contacted: "bg-yellow-100 text-yellow-700",
      Qualified: "bg-purple-100 text-purple-700",
      Converted: "bg-green-100 text-green-700",
      Lost: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      High: "bg-red-100 text-red-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-green-100 text-green-700",
    };
    return styles[priority] || "bg-gray-100 text-gray-700";
  };
  const teamMembers = JSON.parse(
    localStorage.getItem("crmTeamMembers") || "[]",
  );
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Leads
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Track and manage potential customers.
          </p>
        </div>

        <button
          onClick={openAddLead}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition"
        >
          <Plus size={16} className="shrink-0 sm:w-4.5 sm:h-4.5" />
          <span>Add Lead</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <UserPlus size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Total Leads
              </p>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">
                {leads.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            New Leads
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-blue-600 mt-0.5">
            {leads.filter((lead) => lead?.status === "New").length}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Qualified Leads
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-purple-600 mt-0.5">
            {leads.filter((lead) => lead?.status === "Qualified").length}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            High Priority
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5">
            {leads.filter((lead) => lead?.priority === "High").length}
          </h2>
        </div>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-3 sm:p-4 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-36 border border-gray-200 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-36 border border-gray-200 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">

        <div className="divide-y divide-gray-100 lg:hidden">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <div key={lead.id} className="p-3.5 sm:p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                      {(lead.name || "L").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {lead.company || "No company"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${getPriorityStyle(
                      lead.priority,
                    )}`}
                  >
                    {lead.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600 bg-gray-50/60 p-2.5 rounded-lg">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{lead.phone || "-"}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-gray-400">Source: </span>
                    {lead.source}
                  </div>
                  <div className="truncate">
                    <span className="text-gray-400">Assigned: </span>
                    {lead.assignedTo || "Unassigned"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value)
                    }
                    className={`text-xs font-medium px-2 py-0.5 rounded-full outline-none border cursor-pointer ${getStatusStyle(
                      lead.status,
                    )}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditLead(lead)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                      aria-label="Edit lead"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                      aria-label="Delete lead"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-gray-400">
              No leads found.
            </div>
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Lead</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Source</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Assigned</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                          {(lead.name || "L").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 max-w-45">
                          <p className="font-medium text-gray-900 truncate">
                            {lead.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {lead.company || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 truncate max-w-45">
                          <Mail size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate max-w-45">
                          <Phone size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{lead.phone || "-"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-600 truncate max-w-30">
                      {lead.source}
                    </td>

                    <td className="px-5 py-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value)
                        }
                        className={`text-xs font-medium px-2 py-1 rounded-full outline-none border cursor-pointer ${getStatusStyle(
                          lead.status,
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(
                          lead.priority,
                        )}`}
                      >
                        {lead.priority}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-600 truncate max-w-35">
                      {lead.assignedTo || "—"}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditLead(lead)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-xs sm:text-sm text-gray-400"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {editingLead ? "Edit Lead" : "Add New Lead"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Lead Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Inc"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Lead Source
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option>Website</option>
                    <option>Referral</option>
                    <option>Social Media</option>
                    <option>Email Campaign</option>
                    <option>Advertisement</option>
                    <option>Cold Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Converted</option>
                    <option>Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select team member</option>
                    {teamMembers
                      ?.filter((member) => member.status === "Active")
                      ?.map((member) => (
                        <option key={member.id} value={member.name}>
                          {member.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition"
                >
                  {editingLead ? "Update Lead" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
