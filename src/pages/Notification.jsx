import { useNotifications } from "../context/NotificationContext";

const Notification = () => {
  const { notifications, clearNotifications } = useNotifications();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-sm text-red-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
            <span className="text-xs font-semibold uppercase text-blue-600">{n.type}</span>
            <p className="text-sm text-slate-700 mt-1">
              <span className="capitalize font-medium">{n.action}</span>: {n.title}
            </p>
            <span className="text-xs text-slate-400">{n.time} - {n.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;