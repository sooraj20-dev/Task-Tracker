import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Briefcase, 
  Calendar, 
  Activity, 
  Settings,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", icon: <BarChart size={20} />, route: "/dashboard" },
    { name: "Projects", icon: <Briefcase size={20} />, route: "/projects" },
    { name: "Calendar", icon: <Calendar size={20} />, route: "/calendar" },
    { name: "Activities", icon: <Activity size={20} />, route: "/activities" },
    { name: "Settings", icon: <Settings size={20} />, route: "/settings" }
  ];

  return (
    <div className={`bg-white border-r border-gray-200 w-64 min-h-screen p-4 fixed md:relative transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Task Tracker</h1>
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-1 rounded hover:bg-gray-100"
        >
          <ChevronRight size={20} className="text-gray-500" />
        </button>
      </div>
      
      <nav className="space-y-1">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            to={item.route}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.route
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className={`${
              location.pathname === item.route ? 'text-gray-700' : 'text-gray-500'
            }`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
            {location.pathname === item.route && (
              <ChevronRight size={16} className="ml-auto text-gray-500" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;