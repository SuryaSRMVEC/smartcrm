import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  BriefcaseBusiness,
  IndianRupee,
} from "lucide-react";
import { useNotifications } from "../context/useNotifications";
import { getUserItem, setUserItem } from "../utils/userStorage";

const Deals = () => {
  const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won"];
  const notifyDashboard = () => {
    window.dispatchEvent(new Event("crmDataUpdated"));
  };
  const [deals, setDeals] = useState(() => getUserItem("crmDeals", []));

  useEffect(() => {
    setUserItem("crmDeals", deals);
    window.dispatchEvent(new Event("crmDataUpdated"));
    notifyDashboard(); 
  }, [deals]);

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  const [showCard, setShowCard] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    customer: "",
    company: "",
    value: "",
    stage: "New",
    priority: "Medium",
    assignedTo: "Surya",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    localStorage.setItem("crmDeals", JSON.stringify(deals));
    window.dispatchEvent(new Event("crmDataUpdated"));
  }, [deals]);

  const filteredDeals = deals.filter((deal) => {
    const searchText = (search || "").toLowerCase();

    const title = (deal?.title || "").toLowerCase();
    const customer = (deal?.customer || "").toLowerCase();
    const company = (deal?.company || "").toLowerCase();

    const matchesSearch =
      title.includes(searchText) ||
      customer.includes(searchText) ||
      company.includes(searchText);

    const matchesStage = stageFilter === "All" || deal?.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const totalPipeline = deals.reduce(
    (sum, deal) => sum + Number(deal.value || 0),
    0,
  );

  const wonValue = deals
    .filter((deal) => deal.stage === "Won")
    .reduce((sum, deal) => sum + Number(deal.value || 0), 0);

  const openAddDeal = () => {
    setEditingDeal(null);
    setFormData({
      title: "",
      customer: "",
      company: "",
      value: "",
      stage: "New",
      priority: "Medium",
      assignedTo: "Surya",
      date: new Date().toISOString().split("T")[0],
    });
    setShowCard(true);
  };

  const openEditDeal = (deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title || "",
      customer: deal.customer || "",
      company: deal.company || "",
      value: deal.value || "",
      stage: deal.stage || "New",
      priority: deal.priority || "Medium",
      assignedTo: deal.assignedTo || "Surya",
      date: deal.date || new Date().toISOString().split("T")[0],
    });
    setShowCard(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStageStyle = (stage) => {
    switch (stage) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Qualified":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Proposal":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Negotiation":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Won":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600";
      case "Medium":
        return "bg-yellow-50 text-yellow-600";
      case "Low":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const { addNotification } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.customer ||
      !formData.company ||
      !formData.value ||
      !formData.date
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingDeal) {
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === editingDeal.id
            ? {
                ...deal,
                ...formData,
                value: Number(formData.value),
              }
            : deal,
        ),
      );

      // Trigger update notification
      addNotification("Deal", "updated", formData.title || "Deal updated");
    } else {
      const newDeal = {
        id: Date.now(),
        ...formData,
        value: Number(formData.value),
        createdAt: new Date().toISOString(),
      };

      setDeals((prev) => [...prev, newDeal]);

      // Trigger create notification
      addNotification("Deal", "created", newDeal.title || "New Deal");
    }

    setShowCard(false);
    setEditingDeal(null);
  };

  // 3. Updated handleDelete triggers delete notification
  const handleDelete = (id) => {
    const dealToDelete = deals.find((deal) => deal.id === id);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this deal?",
    );
    if (!confirmDelete) return;

    setDeals((prev) => prev.filter((deal) => deal.id !== id));

    // Trigger delete notification
    addNotification("Deal", "deleted", dealToDelete?.title || "Deal removed");
  };

  const changeStage = (id, newStage) => {
    const targetDeal = deals.find((deal) => deal.id === id);

    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id ? { ...deal, stage: newStage } : deal,
      ),
    );

    addNotification(
      "Deal",
      "updated",
      `${targetDeal?.title || "Deal"} moved to ${newStage}`,
    );
  };

  const teamMembers = JSON.parse(
    localStorage.getItem("crmTeamMembers") || "[]",
  );
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Deals Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Manage your sales opportunities and deals.
          </p>
        </div>

        <button
          onClick={openAddDeal}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition"
        >
          <Plus size={16} className="shrink-0 sm:w-4.5 sm:h-4.5" />
          <span>Add Deal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <BriefcaseBusiness size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Total Deals
              </p>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">
                {deals.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Pipeline Value
          </p>
          <h2 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-bold text-blue-600 mt-0.5 break-all sm:break-normal">
            ₹{totalPipeline.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Won Value
          </p>
          <h2 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-bold text-emerald-600 mt-0.5 break-all sm:break-normal">
            ₹{wonValue.toLocaleString()}
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
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full sm:w-44 border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          >
            <option value="All">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
        <div className="flex gap-3 sm:gap-4 min-w-max items-start">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter(
              (deal) => deal.stage === stage,
            );

            const stageValue = stageDeals.reduce(
              (sum, deal) => sum + Number(deal.value || 0),
              0,
            );

            return (
              <div
                key={stage}
                className="w-72 sm:w-80 shrink-0 bg-gray-50/80 border border-gray-200/80 rounded-xl overflow-hidden flex flex-col shadow-xs"
              >

                <div className="bg-white px-3.5 py-3 border-b border-gray-200/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {stage}
                    </h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0">
                      {stageDeals.length}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-1 font-medium">
                    ₹{stageValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 min-h-80 max-h-[calc(100vh-300px)] overflow-y-auto space-y-2.5">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-lg border border-gray-200/80 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-1">
                          {deal.title}
                        </h4>
                        <button
                          onClick={() => openEditDeal(deal)}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition shrink-0"
                          aria-label="Edit Deal"
                        >
                          <Edit size={14} />
                        </button>
                      </div>

                      <div className="text-xs text-gray-500">
                        <p className="font-medium text-gray-700 truncate">
                          {deal.customer}
                        </p>
                        <p className="text-gray-400 truncate">
                          {deal.company || "-"}
                        </p>
                      </div>

                      <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-900 pt-0.5">
                        <IndianRupee size={14} className="shrink-0" />
                        <span>{Number(deal.value || 0).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-gray-100 flex-wrap text-[11px] text-gray-500">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${getPriorityStyle(
                            deal.priority,
                          )}`}
                        >
                          {deal.priority}
                        </span>
                        <span className="truncate max-w-25">
                          {deal.assignedTo || "Unassigned"}
                        </span>
                        <span>
                          {deal.date
                            ? new Date(deal.date).toLocaleDateString("en-IN")
                            : "No date"}
                        </span>
                      </div>

                      <div className="pt-2 space-y-1.5">
                        <select
                          value={deal.stage}
                          onChange={(e) => changeStage(deal.id, e.target.value)}
                          className={`w-full text-xs border rounded-md px-2 py-1 outline-none cursor-pointer ${getStageStyle(
                            deal.stage,
                          )}`}
                        >
                          {stages.map((item) => (
                            <option key={item} value={item}>
                              Move to {item}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleDelete(deal.id)}
                          className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 py-1 rounded transition"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="flex items-center justify-center h-40 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCard && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {editingDeal ? "Edit Deal" : "Add New Deal"}
              </h2>
              <button
                onClick={() => setShowCard(false)}
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
                    Deal Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter deal name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Customer *
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    placeholder="Enter customer"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Deal Value (₹) *
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="Enter deal value"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Deal Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Stage
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
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
                  onClick={() => setShowCard(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition"
                >
                  {editingDeal ? "Update Deal" : "Add Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
