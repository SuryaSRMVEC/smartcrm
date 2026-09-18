import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  IndianRupee,
  Users,
  CheckCircle,
} from "lucide-react";
import { getUserItem } from "../utils/userStorage";

const Reports = () => {
  const [filter, setFilter] = useState("All");
  const [leads, setLeads] = useState(() => getUserItem("crmLeads", []));
  const [deals, setDeals] = useState(() => getUserItem("crmDeals", []));
  const [tasks, setTasks] = useState(() => getUserItem("crmTasks", []));

  useEffect(() => {
    const handleSync = () => {
      setLeads(getUserItem("crmLeads", []));
      setDeals(getUserItem("crmDeals", []));
      setTasks(getUserItem("crmTasks", []));
    };

    window.addEventListener("crmDataUpdated", handleSync);
    return () => window.removeEventListener("crmDataUpdated", handleSync);
  }, []);

  const filteredDeals =
    filter === "All"
      ? deals
      : deals.filter((deal) => deal.stage === filter);

  const totalPipeline = deals
    .filter((deal) => deal.stage !== "Lost")
    .reduce((total, deal) => total + Number(deal.value || 0), 0);

  const wonRevenue = deals
    .filter((deal) => deal.stage === "Won")
    .reduce((total, deal) => total + Number(deal.value || 0), 0);

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const leadConversion =
    leads.length > 0
      ? ((convertedLeads / leads.length) * 100).toFixed(1)
      : 0;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const taskCompletion =
    tasks.length > 0
      ? ((completedTasks / tasks.length) * 100).toFixed(1)
      : 0;


  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyRevenue = months.map((month) => ({
    month,
    revenue: 0,
  }));

  deals
    .filter((deal) => deal.stage?.trim().toLowerCase() === "won")
    .forEach((deal) => {
      const rawDate = deal.createdAt || deal.date || deal.closingDate || deal.created_at;
      let date = null;

      if (rawDate) {
        if (typeof rawDate === "string" && rawDate.includes("/")) {
          const parts = rawDate.split("/");
          if (parts.length === 3 && parts[0].length <= 2) {
            date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
        if (!date || isNaN(date.getTime())) {
          date = new Date(rawDate);
        }
      } else {
        date = new Date();
      }

      if (!isNaN(date.getTime())) {
        const monthIndex = date.getMonth();
        const dealValue = Number(deal.value) || 0;
        monthlyRevenue[monthIndex].revenue += dealValue;
      }
    });

  const stageNames = [
    "New",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Won",
    "Lost",
  ];

  const dealsByStage = stageNames.map((stage) => ({
    stage,
    deals: deals.filter((deal) => deal.stage === stage).length,
  }));

  const leadStatuses = [
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Lost",
  ];

  const leadsByStatus = leadStatuses.map((status) => ({
    name: status,
    value: leads.filter((lead) => lead.status === status).length,
  }));

const teamMembers = getUserItem("crmTeamMembers", []);

const activeTeamMembers = teamMembers.filter(
  (member) => member.status === "Active"
);

const salespersonPerformance = activeTeamMembers.map((member) => {
  const personDeals = deals.filter(
    (deal) => deal.assignedTo === member.name
  );

  const revenue = personDeals
    .filter((deal) => deal.stage === "Won")
    .reduce(
      (total, deal) => total + Number(deal.value || 0),
      0
    );

  return {
    name: member.name,
    revenue,
    deals: personDeals.length,
  };
});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statusColors = ["#2563eb", "#f59e0b", "#8b5cf6", "#22c55e", "#ef4444"];

  return (
<div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-6 lg:space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            Track your CRM performance and business growth
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-44 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-xs"
        >
          <option value="All">All Deals</option>
          {stageNames.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">

        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
              Total Pipeline
            </p>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 mt-0.5 sm:mt-1 truncate">
              {formatCurrency(totalPipeline)}
            </h2>
          </div>
          <div className="p-2 sm:p-2.5 lg:p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
              Won Revenue
            </p>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-emerald-600 mt-0.5 sm:mt-1 truncate">
              {formatCurrency(wonRevenue)}
            </h2>
          </div>
          <div className="p-2 sm:p-2.5 lg:p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
              Lead Conversion
            </p>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 mt-0.5 sm:mt-1 truncate">
              {leadConversion}%
            </h2>
          </div>
          <div className="p-2 sm:p-2.5 lg:p-3 bg-purple-50 text-purple-600 rounded-lg shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
              Task Completion
            </p>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 mt-0.5 sm:mt-1 truncate">
              {taskCompletion}%
            </h2>
          </div>
          <div className="p-2 sm:p-2.5 lg:p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 lg:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
            Monthly Revenue
          </h2>
          <span className="text-[11px] sm:text-xs text-slate-400">Past 12 Months</span>
        </div>
        <div className="w-full h-64 sm:h-72 lg:h-80 -ml-2 sm:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 lg:p-6 shadow-xs">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 mb-4">
            Deals by Stage
          </h2>
          <div className="w-full h-60 sm:h-72 -ml-2 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealsByStage} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="deals" fill="#2563eb" radius={[4, 4, 0, 0]} name="Deals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 lg:p-6 shadow-xs">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 mb-4">
            Leads by Status
          </h2>
          <div className="w-full h-60 sm:h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  innerRadius="40%"
                  paddingAngle={3}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {leadsByStatus.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 lg:p-6 shadow-xs">
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 mb-4">
          Salesperson Performance
        </h2>
        <div className="w-full h-64 sm:h-72 lg:h-80 -ml-2 sm:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salespersonPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                formatter={(value, name) => [
                  name === "Revenue" ? formatCurrency(value) : value,
                  name,
                ]}
                contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="deals" fill="#2563eb" radius={[4, 4, 0, 0]} name="Deals" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
            Sales Summary
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {filteredDeals.length} Deals
          </span>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {filteredDeals.length > 0 ? (
            filteredDeals.map((deal) => (
              <div key={deal.id} className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {deal.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {deal.customer || deal.company || "No customer"}
                    </p>
                  </div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    {deal.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                  <span className="text-[11px] text-slate-400 font-medium">Value</span>
                  <span className="text-xs font-bold text-slate-900">
                    {formatCurrency(Number(deal.value || 0))}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No deals found.
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Deal</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Stage</th>
                <th className="px-5 py-3.5 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900 truncate max-w-50 xl:max-w-xs">
                      {deal.title}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 truncate max-w-45 xl:max-w-xs">
                      {deal.customer || deal.company || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-900">
                      {formatCurrency(Number(deal.value || 0))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-xs sm:text-sm text-slate-400">
                    No deals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;