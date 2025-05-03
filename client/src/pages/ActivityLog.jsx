import { useState } from "react";
import { 
  Clock, 
  CheckCircle, 
  Trash2, 
  Edit, 
  Plus, 
  Calendar, 
  Star,
  Filter,
  RefreshCw,
  Bell,
  User
} from "lucide-react";

export default function ActivityLog() {
  // Sample activity data
  const [activities, setActivities] = useState([
    // ... (keep your existing activity data)
  ]);

  const [filter, setFilter] = useState("all");
  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  // Mock user data since we don't have the context
  const [user, setUser] = useState({
    name: "John Doe",
    avatar: null
  });

  // Mock date functions
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Mock toggle function
  const toggleSidebar = () => {
    console.log("Sidebar toggled");
  };

  // ... (keep all your existing helper functions: formatTime, getActivityIcon, etc.)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-1 mr-3 md:hidden rounded-full hover:bg-gray-100">
              <Clock size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Clock size={14} className="mr-1" />
                {formattedDate} | {formattedTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User size={20} className="text-blue-600" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* ... (keep the rest of your existing activity log content) ... */}
      </main>
    </div>
  );
}