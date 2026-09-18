import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Mail,
  Phone,
  Building2,
  UserRound,
} from "lucide-react";
import { useNotifications } from "../context/useNotifications";
import { getUserItem, setUserItem } from "../utils/userStorage";

const Contacts = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowform] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    type: "Customer",
    status: "Active",
    notes: "",
  });
  const notifyDashboard = () => {
    window.dispatchEvent(new Event("crmDataUpdated"));
  };

  const [contacts, setContacts] = useState(() =>
    getUserItem("crmContacts", []),
  );

  const saveContacts = (updatedContacts) => {
    setContacts(updatedContacts);
    setUserItem("crmContacts", updatedContacts);
    window.dispatchEvent(new Event("crmDataUpdated"));
    notifyDashboard(); 
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddContact = () => {
    setEditingContact(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      type: "Customer",
      status: "Active",
      notes: "",
    });

    setShowform(true);
  };

  const openEditContact = (contact) => {
    setEditingContact(contact);
    setFormData(contact);
    setShowform(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill Name, Email and Phone");
      return;
    }

    if (editingContact) {
      const updatedContacts = contacts.map((contact) =>
        contact.id === editingContact.id
          ? { ...formData, id: editingContact.id }
          : contact,
      );

      saveContacts(updatedContacts);

      // Trigger update notification
      addNotification("Contact", "updated", formData.name);
    } else {
      const newContact = {
        ...formData,
        id: Date.now(),
      };

      saveContacts([...contacts, newContact]);

      // Trigger create notification
      addNotification("Contact", "created", newContact.name);
    }

    setShowform(false);
  };

  const handleDelete = (id) => {
    const contactToDelete = contacts.find((contact) => contact.id === id);

    if (window.confirm("Are you sure you want to delete this contact?")) {
      const updatedContacts = contacts.filter((contact) => contact.id !== id);

      saveContacts(updatedContacts);

      // Trigger delete notification
      addNotification(
        "Contact",
        "deleted",
        contactToDelete?.name || "Contact removed",
      );
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase()) ||
      contact.company.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "All" || contact.type === typeFilter;

    const matchesStatus =
      statusFilter === "All" || contact.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(
    (contact) => contact.status === "Active",
  ).length;
  const customers = contacts.filter(
    (contact) => contact.type === "Customer",
  ).length;
  const leads = contacts.filter((contact) => contact.type === "Lead").length;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Contacts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Manage your business contacts and relationships.
          </p>
        </div>

        <button
          onClick={openAddContact}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition"
        >
          <Plus size={16} className="shrink-0 sm:w-4.5 sm:h-4.5" />
          <span>Add Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Total Contacts
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">
            {totalContacts}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Active Contacts
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-emerald-600 mt-0.5">
            {activeContacts}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Customers
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-blue-600 mt-0.5">
            {customers}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">Leads</p>
          <h2 className="text-lg sm:text-2xl font-bold text-purple-600 mt-0.5">
            {leads}
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
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full sm:w-36 border border-gray-200 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              <option value="All">All Types</option>
              <option value="Customer">Customer</option>
              <option value="Lead">Lead</option>
              <option value="Partner">Partner</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-36 border border-gray-200 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">

        <div className="divide-y divide-gray-100 lg:hidden">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div key={contact.id} className="p-3.5 sm:p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <UserRound size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {contact.role || "No role specified"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                      contact.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {contact.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600 bg-gray-50/60 p-2.5 rounded-lg">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{contact.company || "-"}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-gray-400">Type: </span>
                    <span className="font-medium text-gray-700">
                      {contact.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{contact.phone || "-"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-50">
                  <button
                    onClick={() => openEditContact(contact)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                    aria-label="Edit Contact"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                    aria-label="Delete Contact"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-gray-400">
              No contacts found.
            </div>
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Company</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <UserRound size={15} />
                        </div>
                        <div className="min-w-0 max-w-50">
                          <p className="font-medium text-gray-900 truncate">
                            {contact.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="truncate">{contact.email}</span>
                            <span>•</span>
                            <span className="whitespace-nowrap">
                              {contact.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-600 truncate max-w-37.5">
                      <div className="flex items-center gap-1.5">
                        <Building2
                          size={14}
                          className="text-gray-400 shrink-0"
                        />
                        <span className="truncate">
                          {contact.company || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-600 truncate max-w-30">
                      {contact.role || "—"}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {contact.type}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contact.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditContact(contact)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          aria-label="Edit Contact"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          aria-label="Delete Contact"
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
                    colSpan="6"
                    className="text-center py-10 text-xs sm:text-sm text-gray-400"
                  >
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded-xl border border-gray-100 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {editingContact ? "Edit Contact" : "Add Contact"}
              </h2>
              <button
                onClick={() => setShowform(false)}
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
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
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
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone"
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
                    onChange={handleInputChange}
                    placeholder="Enter company"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Manager / CEO / Developer"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Lead">Lead</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Add notes..."
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowform(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition"
                >
                  {editingContact ? "Update Contact" : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
