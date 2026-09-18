import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Circle,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import { useNotifications } from "../context/useNotifications";
import { getUserItem, setUserItem } from "../utils/userStorage";

const notifyDashboard = () => {
  window.dispatchEvent(new Event("crmDataUpdated"));
};

const Tasks = () => {
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState(() => getUserItem("crmTasks", []));

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    setUserItem("crmTasks", updatedTasks);
    notifyDashboard();
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "Follow-up",
    relatedTo: "",
    dueDate: "",
    dueTime: "",
    priority: "Medium",
    status: "Pending",
    assignedTo: "Surya",
    notes: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddTask = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      type: "Follow-up",
      relatedTo: "",
      dueDate: "",
      dueTime: "",
      priority: "Medium",
      status: "Pending",
      assignedTo: "Surya",
      notes: "",
    });
    setShowForm(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setFormData(task);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate) {
      alert("Please enter task title and due date");
      return;
    }

    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...formData,
              id: editingTask.id,
            }
          : task,
      );

      saveTasks(updatedTasks);
      addNotification("Task", "updated", formData.title);
    } else {
      const newTask = {
        ...formData,
        id:
          tasks.length > 0
            ? Math.max(...tasks.map((t) => Number(t.id) || 0)) + 1
            : 1,
      };
      saveTasks([...tasks, newTask]);
      addNotification("Task", "created", newTask.title);
    }

    setShowForm(false);
  };

  const handleDelete = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);

    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      saveTasks(updatedTasks);

      addNotification("Task", "deleted", taskToDelete?.title || "Task removed");
    }
  };

  const toggleTaskStatus = (id) => {
    const targetTask = tasks.find((t) => t.id === id);
    const newStatus =
      targetTask?.status === "Completed" ? "Pending" : "Completed";

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task,
    );

    saveTasks(updatedTasks);
    addNotification(
      "Task",
      "updated",
      `"${targetTask?.title || "Task"}" marked as ${newStatus}`,
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const searchText = (search || "").toLowerCase();
    const title = (task?.title || "").toLowerCase();
    const relatedTo = (task?.relatedTo || "").toLowerCase();
    const assignedTo = (task?.assignedTo || "").toLowerCase();

    const matchesSearch =
      title.includes(searchText) ||
      relatedTo.includes(searchText) ||
      assignedTo.includes(searchText);

    const matchesStatus =
      statusFilter === "All" || task?.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task?.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task?.status === "Completed",
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task?.status === "Pending",
  ).length;
  const highPriorityTasks = tasks.filter(
    (task) => task?.priority === "High",
  ).length;

  const getPriorityStyle = (priority) => {
    if (priority === "High") return "bg-red-100 text-red-700";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusStyle = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

const teamMembers = JSON.parse(
  localStorage.getItem("crmTeamMembers") || "[]"
);

  return (
<div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Tasks & Activities
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Manage follow-ups, meetings and daily activities.
          </p>
        </div>

        <button
          onClick={openAddTask}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition"
        >
          <Plus size={16} className="shrink-0 sm:w-4.5 sm:h-4.5" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Total Tasks
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">
            {totalTasks}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Pending
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-amber-600 mt-0.5">
            {pendingTasks}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Completed
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-emerald-600 mt-0.5">
            {completedTasks}
          </h2>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-5 shadow-xs flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            High Priority
          </p>
          <h2 className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5">
            {highPriorityTasks}
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
              placeholder="Search tasks..."
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
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
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
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="p-3.5 sm:p-4 space-y-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-0.5 shrink-0 transition ${
                        task.status === "Completed"
                          ? "text-emerald-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      aria-label="Toggle task status"
                    >
                      {task.status === "Completed" ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold truncate ${
                          task.status === "Completed"
                            ? "line-through text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="inline-block text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1">
                        {task.type}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${getPriorityStyle(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600 bg-gray-50/60 p-2.5 rounded-lg">
                  <div className="truncate">
                    <span className="text-gray-400">Related: </span>
                    <span className="font-medium text-gray-700">
                      {task.relatedTo || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{task.dueDate}</span>
                    {task.dueTime && (
                      <span className="text-gray-400 text-[11px]">
                        ({task.dueTime})
                      </span>
                    )}
                  </div>
                  <div className="truncate col-span-1 sm:col-span-2">
                    <span className="text-gray-400">Assigned: </span>
                    <span className="text-gray-700">
                      {task.assignedTo || "Unassigned"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditTask(task)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                      aria-label="Edit Task"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                      aria-label="Delete Task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-gray-400">
              No tasks found.
            </div>
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Task</th>
                <th className="px-5 py-3.5">Related To</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Assigned To</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`shrink-0 transition ${
                            task.status === "Completed"
                              ? "text-emerald-600"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                          aria-label="Toggle task status"
                        >
                          {task.status === "Completed" ? (
                            <CheckCircle size={18} />
                          ) : (
                            <Circle size={18} />
                          )}
                        </button>
                        <div className="min-w-0 max-w-60">
                          <p
                            className={`font-medium truncate ${
                              task.status === "Completed"
                                ? "line-through text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {task.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-600 truncate max-w-37.5">
                      {task.relatedTo || "-"}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar size={14} className="text-gray-400 shrink-0" />
                        <div>
                          <p>{task.dueDate}</p>
                          {task.dueTime && (
                            <p className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Clock size={11} />
                              {task.dueTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-600 truncate max-w-35">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate">
                          {task.assignedTo || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditTask(task)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          aria-label="Edit Task"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          aria-label="Delete Task"
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
                    No tasks found.
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
                {editingTask ? "Edit Task" : "Add Task"}
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
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Task Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Follow-up">Follow-up</option>
                    <option value="Call">Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Email">Email</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Related To
                  </label>
                  <input
                    type="text"
                    name="relatedTo"
                    value={formData.relatedTo}
                    onChange={handleInputChange}
                    placeholder="Customer / Lead"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    name="dueTime"
                    value={formData.dueTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
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

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add task notes..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
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
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
