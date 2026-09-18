import { useCallback, useEffect, useState } from "react";

import {
  Users,
  UserPlus,
  BriefcaseBusiness,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { getUserItem } from "../utils/userStorage";

const emptyData = {
  customers: [],
  leads: [],
  deals: [],
  tasks: [],
};

const loadUserData = () => {
  try {
    return {
      customers: getUserItem("crmCustomers", []),
      leads: getUserItem("crmLeads", []),
      deals: getUserItem("crmDeals", []),
      tasks: getUserItem("crmTasks", []),
    };
  } catch {
    return emptyData;
  }
};

const Dashboard = () => {
  const [data, setData] = useState(loadUserData);

  const refreshDashboard = useCallback(() => {
    setData(loadUserData());
  }, []);

  useEffect(() => {
    const handleCRMUpdate = () => {
      refreshDashboard();
    };

    const handleStorage = () => {
      refreshDashboard();
    };

    const handleFocus = () => {
      refreshDashboard();
    };

    window.addEventListener("crmDataUpdated", handleCRMUpdate);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    const interval = setInterval(() => {
      refreshDashboard();
    }, 1000);

    return () => {
      window.removeEventListener(
        "crmDataUpdated",
        handleCRMUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      clearInterval(interval);
    };
  }, [refreshDashboard]);

  const {
    customers,
    leads,
    deals,
    tasks,
  } = data;

const getCurrentUserName = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    return (
      user?.name ||
      user?.email?.split("@")[0] ||
      "User"
    );
  } catch {
    return "User";
  }
};

const userName = getCurrentUserName();
const UppercaseFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
const formattedUserName = UppercaseFirstLetter(userName);

  const activeLeads = leads.filter(
    (lead) =>
      lead.status !== "Converted" &&
      lead.status !== "Lost"
  ).length;

  const activeDeals = deals.filter(
    (deal) =>
      deal.stage !== "Won" &&
      deal.stage !== "Lost"
  ).length;

  const totalRevenue = deals
    .filter((deal) => deal.stage === "Won")
    .reduce(
      (total, deal) =>
        total + Number(deal.value || 0),
      0
    );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const stats = [
    {
      title: "Total Customers",
      value: customers.length.toLocaleString(),
      change: "Live",
      icon: Users,
    },
    {
      title: "Active Leads",
      value: activeLeads.toLocaleString(),
      change: "Live",
      icon: UserPlus,
    },
    {
      title: "Active Deals",
      value: activeDeals.toLocaleString(),
      change: "Live",
      icon: BriefcaseBusiness,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "Won Deals",
      icon: IndianRupee,
    },
  ];

  const revenueData = deals
    .filter(
      (deal) =>
        deal.stage === "Won" &&
        deal.date
    )
    .reduce((acc, deal) => {
      const parsedDate = new Date(deal.date);

      if (Number.isNaN(parsedDate.getTime())) {
        return acc;
      }

      const monthKey = `${parsedDate.getFullYear()}-${String(
        parsedDate.getMonth() + 1
      ).padStart(2, "0")}`;

      const month = parsedDate.toLocaleString(
        "en-US",
        {
          month: "short",
        }
      );

      const existing = acc.find(
        (item) => item.key === monthKey
      );

      if (existing) {
        existing.revenue += Number(
          deal.value || 0
        );
      } else {
        acc.push({
          key: monthKey,
          month,
          revenue: Number(
            deal.value || 0
          ),
        });
      }

      return acc;
    }, [])
    .sort((a, b) =>
      a.key.localeCompare(b.key)
    );

  const recentCustomers = [...customers]
    .reverse()
    .slice(0, 5)
    .map((customer) => {
      const dealValue = deals
        .filter(
          (deal) =>
            deal.customer === customer.name ||
            deal.customerName === customer.name
        )
        .reduce(
          (total, deal) =>
            total +
            Number(deal.value || 0),
          0
        );

      return {
        ...customer,
        value: formatCurrency(
          dealValue
        ),
      };
    });

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "Completed"
  ).length;

  const recentActivity = [
    customers.length > 0 && {
      text: `${customers.length} customer${
        customers.length !== 1
          ? "s"
          : ""
      } available in CRM`,
      time: "Customer data",
    },

    deals.length > 0 && {
      text: `${deals.length} deal${
        deals.length !== 1
          ? "s"
          : ""
      } available in pipeline`,
      time: "Deal data",
    },

    leads.length > 0 && {
      text: `${leads.length} lead${
        leads.length !== 1
          ? "s"
          : ""
      } available`,
      time: "Lead data",
    },

    completedTasks > 0 && {
      text: `${completedTasks} task${
        completedTasks !== 1
          ? "s"
          : ""
      } completed`,
      time: "Task data",
    },
  ].filter(Boolean);

  if (recentActivity.length === 0) {
    recentActivity.push({
      text: "No recent CRM activity",
      time: "Start adding records",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {formattedUserName}!
        </h1>

        <p className="text-gray-500 mt-1">
          Here's what's happening with your CRM today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="text-2xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </h2>

                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <ArrowUpRight size={15} />
                    <span>{stat.change}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-100">
                  <Icon
                    size={24}
                    className="text-gray-700"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Revenue Overview
              </h2>

              <p className="text-sm text-gray-500">
                Revenue from won deals
              </p>
            </div>
          </div>

          <div className="h-72">
            {revenueData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart data={revenueData}>
                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value)
                    }
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="currentColor"
                    fill="currentColor"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No revenue data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            Latest CRM activity
          </p>

          <div className="space-y-5">
            {recentActivity.map(
              (activity, index) => (
                <div
                  key={index}
                  className="flex gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-gray-700 mt-2 shrink-0" />

                  <div>
                    <p className="text-sm text-gray-700">
                      {activity.text}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>


      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Customers
            </h2>

            <p className="text-sm text-gray-500">
              Latest customers added to CRM
            </p>
          </div>
        </div>

        {recentCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-3 px-2">
                    Customer
                  </th>

                  <th className="py-3 px-2">
                    Company
                  </th>

                  <th className="py-3 px-2">
                    Email
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentCustomers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 px-2 font-medium text-gray-800">
                        {customer.name}
                      </td>

                      <td className="py-3 px-2 text-gray-600">
                        {customer.company}
                      </td>

                      <td className="py-3 px-2 text-gray-700">
                        {customer.email}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-400">
            No customers available
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;