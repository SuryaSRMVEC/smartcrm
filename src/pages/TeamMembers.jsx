import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  UserRoundSearch,
  EyeOff,
  Eye,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { useNotifications } from "../context/useNotifications";

const TeamMembers = () => {
  const getInitialTeamMembers = () => {
  const sharedMembers = JSON.parse(
    localStorage.getItem("crmTeamMembers") || "[]"
  );

  if (sharedMembers.length > 0) {
    return sharedMembers;
  }

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const email = currentUser?.email?.trim().toLowerCase();

  if (!email) {
    return [];
  }

  const oldKey = `${email}_crmTeamMembers`;

  const oldMembers = JSON.parse(
    localStorage.getItem(oldKey) || "[]"
  );

  if (oldMembers.length > 0) {
    localStorage.setItem(
      "crmTeamMembers",
      JSON.stringify(oldMembers)
    );

    return oldMembers;
  }

  return [];
};
 const [teamMembers, setTeamMembers] = useState(() =>
  getInitialTeamMembers()
);

  const [search, setSearch] = useState("");
  const [showMember, setShowMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Sales",
    status: "Active",
  });
  const { addNotification } = useNotifications();

useEffect(() => {
  localStorage.setItem("crmTeamMembers", JSON.stringify(teamMembers));
}, [teamMembers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddMember = () => {
    setEditingMember(null);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Sales",
      status: "Active",
    });

    setShowMember(true);
  };

  const openEditMember = (member) => {
    setEditingMember(member);

    setFormData({
      name: member.name,
      email: member.email,
      password: "",
      role: member.role,
      status: member.status,
    });

    setShowMember(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!(formData.name || "").trim() || !(formData.email || "").trim()) {
      return;
    }

    const normalizedEmail = (formData.email || "").trim().toLowerCase();

    const users = JSON.parse(localStorage.getItem("crmUsers") || "[]");

    if (editingMember) {
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id
            ? {
                ...member,
                name: (formData.name || "").trim(),
                email: normalizedEmail,
                role: formData.role,
                status: formData.status,
              }
            : member,
        ),
      );

      const updatedUsers = users.map((user) => {
        if (
          user.email?.trim().toLowerCase() ===
          editingMember.email?.trim().toLowerCase()
        ) {
          return {
            ...user,
            name: (formData.name || "").trim(),
            email: normalizedEmail,
            role: formData.role,
            status: formData.status,
            ...((formData.password || "").trim()
              ? { password: formData.password }
              : {}),
          };
        }

        return user;
      });

      localStorage.setItem("crmUsers", JSON.stringify(updatedUsers));

      addNotification("team", "updated", `${formData.name} updated`);
    } else {

      const existingUser = users.some(
        (user) => user.email?.trim().toLowerCase() === normalizedEmail,
      );

      if (existingUser) {
        alert("A user with this email already exists.");
        return;
      }
      if (!(formData.password || "").trim()) {
        alert("Please enter a password.");
        return;
      }

      const newUser = {
        name: (formData.name || "").trim(),
        email: normalizedEmail,
        password: formData.password,
        role: formData.role,
        status: formData.status,
      };

      localStorage.setItem("crmUsers", JSON.stringify([...users, newUser]));

      const newMember = {
        id: Date.now(),
        name: (formData.name || "").trim(),
        email: normalizedEmail,
        role: formData.role,
        status: formData.status,
      };

      setTeamMembers((prev) => [newMember, ...prev]);

      addNotification("team", "added", `${formData.name} added to team`);
    }

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Sales",
      status: "Active",
    });

    setEditingMember(null);
    setShowMember(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team member?",
    );

    if (!confirmDelete) return;

    const memberToDelete = teamMembers.find((member) => member.id === id);

    setTeamMembers((prev) => prev.filter((member) => member.id !== id));

    if (memberToDelete) {
      addNotification(
        "team",
        "deleted",
        `${memberToDelete.name} removed from team`,
      );
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const value = search.toLowerCase();

    return (
      member.name.toLowerCase().includes(value) ||
      member.email.toLowerCase().includes(value) ||
      member.role.toLowerCase().includes(value)
    );
  });

  return (
  <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
            Team Members
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Manage your CRM team members and assignments.
          </p>
        </div>

        <button
          onClick={openAddMember}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition"
        >
          <Plus size={16} className="shrink-0 sm:w-4.5 sm:h-4.5" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-3 sm:p-4">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16 text-center">
            <div className="mb-3.5 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <UserRoundSearch size={24} className="sm:w-6.5 sm:h-6.5" />
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              No team members found
            </h3>

            <p className="mt-1 max-w-sm text-xs sm:text-sm text-gray-500">
              Add your first team member to start assigning CRM records.
            </p>

            <button
              onClick={openAddMember}
              className="mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              <span>Add Member</span>
            </button>
          </div>
        ) : (
          <>

            <div className="divide-y divide-gray-100 md:hidden">
              {filteredMembers.map((member) => (
                <div key={member.id} className="p-3.5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {member.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <ShieldCheck size={12} className="text-gray-400 shrink-0" />
                          <span className="truncate">{member.role}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                        member.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50/60 p-2.5 rounded-lg truncate">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-50">
                    <button
                      onClick={() => openEditMember(member)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                      aria-label="Edit Member"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                      aria-label="Delete Member"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Full Table (md+ screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-50 xl:max-w-xs">
                            {member.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-gray-600 truncate max-w-50 xl:max-w-xs">
                        {member.email}
                      </td>

                      <td className="px-5 py-3.5 text-xs text-gray-600 truncate max-w-45 xl:max-w-xs">
                        {member.role}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditMember(member)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-3.5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h2>

              <button
                onClick={() => setShowMember(false)}
                className="rounded-md p-1 text-gray-400 hover:text-gray-700 transition"
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
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
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
                  placeholder="Enter email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Password {editingMember ? "(Optional)" : "*"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      editingMember
                        ? "Leave blank to keep current password"
                        : "Enter login password"
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required={!editingMember}
                  />

                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Sales</option>
                    <option>Support</option>
                    <option>Marketing</option>
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
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMember(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition"
                >
                  {editingMember ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
