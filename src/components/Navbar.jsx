import { useState, useRef, useEffect } from "react";
import { Search, Bell, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/useNotifications";

const Navbar = () => {
  const navigate = useNavigate();

  const { notifications, unreadCount, markAllAsRead, clearNotifications } =
    useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  })();

  const email = currentUser?.email || "";
  const initial = email ? email[0].toUpperCase() : "U";
  const userName = currentUser?.name || "User";
  const userRole = currentUser?.role || "Sales";

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const getUserData = (key) => {
    try {
      const userEmail = currentUser?.email?.trim().toLowerCase();

      if (!userEmail) return [];

      const data = localStorage.getItem(`${userEmail}_${key}`);

      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const getSharedData = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const query = value.trim().toLowerCase();

    if (!query) {
      setSearchResults([]);
      return;
    }

    const results = [];

    const teamMembers = getSharedData("crmTeamMembers");

    teamMembers.forEach((member) => {
      if (
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.role?.toLowerCase().includes(query)
      ) {
        results.push({
          id: member.id,
          title: member.name,
          subtitle: `${member.email || ""} • ${member.role || ""}`,
          type: "Team Member",
          path: "/team-members",
        });
      }
    });

    const customers = getUserData("crmCustomers");

    customers.forEach((customer) => {
      if (
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.company?.toLowerCase().includes(query)
      ) {
        results.push({
          id: customer.id,
          title: customer.name,
          subtitle: customer.company || customer.email || "",
          type: "Customer",
          path: "/customers",
        });
      }
    });

    const leads = getUserData("crmLeads");

    leads.forEach((lead) => {
      if (
        lead.name?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.company?.toLowerCase().includes(query)
      ) {
        results.push({
          id: lead.id,
          title: lead.name,
          subtitle: lead.company || lead.email || "",
          type: "Lead",
          path: "/leads",
        });
      }
    });

    const deals = getUserData("crmDeals");

    deals.forEach((deal) => {
      if (
        deal.title?.toLowerCase().includes(query) ||
        deal.customer?.toLowerCase().includes(query) ||
        deal.company?.toLowerCase().includes(query)
      ) {
        results.push({
          id: deal.id,
          title: deal.title,
          subtitle: deal.company || deal.customer || "",
          type: "Deal",
          path: "/deals",
        });
      }
    });

    const contacts = getUserData("crmContacts");

    contacts.forEach((contact) => {
      if (
        contact.name?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.company?.toLowerCase().includes(query)
      ) {
        results.push({
          id: contact.id,
          title: contact.name,
          subtitle: contact.company || contact.email || "",
          type: "Contact",
          path: "/contacts",
        });
      }
    });

    const tasks = getUserData("crmTasks");

    tasks.forEach((task) => {
      if (
        task.title?.toLowerCase().includes(query) ||
        task.assignedTo?.toLowerCase().includes(query) ||
        task.status?.toLowerCase().includes(query)
      ) {
        results.push({
          id: task.id,
          title: task.title,
          subtitle: task.assignedTo || task.status || "",
          type: "Task",
          path: "/tasks",
        });
      }
    });

    setSearchResults(results.slice(0, 10));
  };

  const handleResultClick = (result) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate(result.path);
  };

  const handleToggleDropdown = () => {
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }

    setIsOpen((prev) => !prev);
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "Deal":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Lead":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Customer":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Task":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Team Member":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Contact":
        return "bg-pink-50 text-pink-700 border-pink-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <header className="relative z-30 flex min-h-14 w-full items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2 sm:min-h-16 sm:px-4 md:px-6">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-xs font-semibold text-gray-800 sm:text-sm md:text-base">
          <span className="inline sm:hidden">CRM</span>

          <span className="hidden sm:inline">
            Smart Customer Relationship Management
          </span>
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-4">
        <div ref={searchRef} className="relative">
          <Search
            size={15}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 sm:left-3 sm:size-4.75"
          />

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-28 rounded-lg bg-gray-100 py-1.5 pl-8 pr-2 text-[11px] outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500 sm:w-40 sm:py-2 sm:pl-9 sm:pr-3 sm:text-xs md:w-64 md:text-sm"
          />

         {searchQuery.trim() && (
 <div className="absolute left-0 top-full z-50 mt-2 w-75 max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl sm:w-90 md:w-105">
    {searchResults.length > 0 ? (
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-xs">
            Search Results
          </p>
        </div>

        {searchResults.map((result) => (
          <button
            key={`${result.type}-${result.id}`}
            type="button"
            onClick={() => handleResultClick(result)}
            className="flex w-full items-center gap-3 border-b border-gray-100 px-3 py-3 text-left transition hover:bg-blue-50 sm:px-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-10 sm:w-10">
              <Search size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-gray-800 sm:text-sm">
                {result.title}
              </p>

              <p className="mt-1 truncate text-[10px] text-gray-500 sm:text-xs">
                {result.subtitle}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${getTypeStyle(
                result.type
              )}`}
            >
              {result.type}
            </span>
          </button>
        ))}
      </div>
    ) : (
      <div className="px-4 py-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Search size={20} className="text-gray-400" />
        </div>

        <p className="text-sm font-semibold text-gray-700">
          No results found
        </p>

        <p className="mx-auto mt-1 max-w-60 text-xs leading-5 text-gray-400">
          Try searching for a name, email, company, customer or task.
        </p>
      </div>
    )}
  </div>
)}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleToggleDropdown}
            className={`relative rounded-lg p-1.5 transition sm:p-2 ${
              isOpen
                ? "bg-gray-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Notifications"
          >
            <Bell size={17} className="sm:size-4.75 md:size-5" />

            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-bold text-white ring-2 ring-white sm:right-1 sm:top-1 sm:h-4 sm:min-w-4 sm:text-[10px]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:w-96">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 p-2.5 sm:p-3.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="text-xs font-semibold text-slate-800 sm:text-sm">
                    Recent Activity
                  </h3>

                  {notifications.length > 0 && (
                    <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-medium text-slate-700 sm:text-[11px]">
                      {notifications.length}
                    </span>
                  )}
                </div>

                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="flex items-center gap-1 text-[10px] text-slate-500 transition hover:text-red-600 sm:text-xs"
                    title="Clear all activities"
                  >
                    <Trash2 size={11} className="sm:size-3.25" />
                    Clear
                  </button>
                )}
              </div>

              <div className="max-h-[65vh] divide-y divide-slate-100 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 text-left transition hover:bg-slate-50 sm:p-3 ${
                        !item.read ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span
                          className={`rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider sm:px-2 sm:text-[10px] ${getTypeStyle(
                            item.type,
                          )}`}
                        >
                          {item.type}
                        </span>

                        <span className="flex items-center gap-1 text-[9px] text-slate-400 sm:text-[11px]">
                          <Clock size={10} className="sm:size-3" />
                          {item.time}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-700 sm:text-xs">
                        <span className="font-semibold capitalize text-slate-900">
                          {item.action}
                        </span>
                        : <span className="font-medium">{item.title}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 sm:py-10">
                    <CheckCircle2
                      size={27}
                      className="mx-auto mb-2 text-slate-300 sm:size-8"
                    />

                    <p className="text-[10px] font-medium sm:text-xs">
                      No recent activity
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 border-l border-gray-100 pl-2 sm:gap-2 sm:border-transparent sm:pl-1 md:gap-3 md:pl-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold uppercase text-white sm:h-8 sm:w-8 sm:text-xs md:h-9 md:w-9 md:text-sm">
            {initial}
          </div>

          <div className="hidden min-w-0 text-left sm:block">
            <p className="max-w-24 truncate text-xs font-semibold leading-tight text-gray-800 md:max-w-35 md:text-sm">
              {userName || "User"}
            </p>

            <p className="truncate text-[10px] text-slate-400 md:text-xs">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
