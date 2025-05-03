import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, CheckCircle, Calendar, Clock, 
  Briefcase, LogOut, User, Activity,
  ChevronRight, Bell, Settings, Search
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [user, setUser] = useState({
    name: "Loading...",
    email: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser({
          name: response.data.name, // Full name from database
          email: response.data.email
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const summaryData = [
    { id: 1, title: "Total Projects", value: 24, icon: <Briefcase size={20} />, color: "bg-blue-500" },
    { id: 2, title: "Tasks Completed", value: 128, icon: <CheckCircle size={20} />, color: "bg-green-500" },
    { id: 3, title: "Ongoing Projects", value: 8, icon: <Activity size={20} />, color: "bg-yellow-500" },
    { id: 4, title: "Upcoming Deadlines", value: 5, icon: <Calendar size={20} />, color: "bg-red-500" }
  ];

  const recentActivity = [
    { id: 1, project: "Website Redesign", status: "In Progress", deadline: "May 15, 2025", statusColor: "text-yellow-500" },
    { id: 2, project: "Mobile App Development", status: "Completed", deadline: "Apr 28, 2025", statusColor: "text-green-500" },
    { id: 3, project: "Marketing Campaign", status: "Planning", deadline: "May 20, 2025", statusColor: "text-blue-500" },
    { id: 4, project: "Database Migration", status: "Delayed", deadline: "May 10, 2025", statusColor: "text-red-500" },
    { id: 5, project: "User Testing", status: "Scheduled", deadline: "May 12, 2025", statusColor: "text-purple-500" }
  ];

  const chartData = [
    { month: "Jan", projects: 4, tasks: 24 },
    { month: "Feb", projects: 6, tasks: 32 },
    { month: "Mar", projects: 8, tasks: 48 },
    { month: "Apr", projects: 10, tasks: 56 },
    { month: "May", projects: 12, tasks: 64 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/authpage', {
      state: { 
        autoFillEmail: user.email,
        message: 'Logged out successfully'
      },
      replace: true
    });
  };

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  const renderBarChart = () => {
    const maxValue = Math.max(...chartData.map(item => item.tasks));
    return (
      <div className="flex h-40 items-end justify-between space-x-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-12 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${(data.tasks / maxValue) * 100}%` }}></div>
            <div className="mt-2 text-xs font-medium">{data.month}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">TaskTracker</h1>
            <p className="text-sm text-gray-500">
              {formattedDate} | {formattedTime}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Bell size={20} className="text-gray-600" />
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Now takes full width */}
      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, {user.name}</h2>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryData.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg shadow-md text-white ${item.color}`}>
              <div className="flex items-center space-x-2">
                {item.icon}
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activities</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Project</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-t">
                    <td className="px-4 py-2 font-medium text-gray-700">{activity.project}</td>
                    <td className={`px-4 py-2 font-medium ${activity.statusColor}`}>{activity.status}</td>
                    <td className="px-4 py-2 text-gray-500">{activity.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Task Overview</h3>
          {renderBarChart()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;