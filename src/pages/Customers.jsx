import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, X, Users } from "lucide-react";
import { useNotifications } from "../context/useNotifications";
import { getUserItem, setUserItem } from "../utils/userStorage";

const Customers = () => {
  const { addNotification } = useNotifications();

  const [customers, setCustomers] = useState(() =>
    getUserItem("crmCustomers", []),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCustomer, setShowCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
  });
  const notifyDashboard = () => {
    window.dispatchEvent(new Event("crmDataUpdated"));
  };
  useEffect(() => {
    setUserItem("crmCustomers", customers);
    window.dispatchEvent(new Event("crmDataUpdated"));
    notifyDashboard();
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("crmCustomers", JSON.stringify(customers));

    notifyDashboard();
  }, [customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openAddCustomer = () => {
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "Active",
    });

    setShowCustomer(true);
  };

  const openEditCustomer = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status,
    });

    setShowCustomer(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.company
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingCustomer) {
      setCustomers(
        customers.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                ...formData,
              }
            : customer,
        ),
      );

      // Trigger update notification
      addNotification("Customer", "updated", formData.name);
    } else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
      };

      setCustomers([...customers, newCustomer]);

      // Trigger create notification
      addNotification("Customer", "created", newCustomer.name);
    }

    setShowCustomer(false);
  };

  const handleDelete = (id) => {
    const customerToDelete = customers.find((c) => c.id === id);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) return;

    setCustomers(customers.filter((customer) => customer.id !== id));

    // Trigger delete notification
    addNotification(
      "Customer",
      "deleted",
      customerToDelete?.name || "Customer removed",
    );
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.company.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Manage your customers and their account details.
          </p>
        </div>

        <button
          onClick={openAddCustomer}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition"
        >
          <Plus size={16} className="shrink-0 sm:w-4.5 sm:h-4.5" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Users size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Total Customers
              </p>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">
                {customers.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Active Customers
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-emerald-600 mt-0.5">
            {customers.filter((c) => c.status === "Active").length}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Pending Customers
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-amber-600 mt-0.5">
            {customers.filter((c) => c.status === "Pending").length}
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
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="divide-y divide-gray-100 md:hidden">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                      {customer.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {customer.name}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                      customer.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-500 pt-1">
                  <div className="truncate">
                    <span className="text-gray-400">Email: </span>
                    {customer.email}
                  </div>
                  <div className="truncate">
                    <span className="text-gray-400">Phone: </span>
                    {customer.phone}
                  </div>
                  <div className="col-span-2 truncate">
                    <span className="text-gray-400">Company: </span>
                    {customer.company}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => openEditCustomer(customer)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    aria-label="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-gray-400">
              No customers found.
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Company</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 truncate">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 truncate max-w-50">
                      {customer.email}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                      {customer.phone}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 truncate max-w-48">
                      {customer.company}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditCustomer(customer)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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
                    colSpan="6"
                    className="text-center py-10 text-sm text-gray-400"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {editingCustomer ? "Edit Customer" : "Add Customer"}
              </h2>
              <button
                onClick={() => setShowCustomer(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4"
            >
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Customer Name
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
                  Email Address
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
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
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
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCustomer(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition"
                >
                  {editingCustomer ? "Update Customer" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
