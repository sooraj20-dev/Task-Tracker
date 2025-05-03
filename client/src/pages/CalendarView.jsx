import { useState, useEffect } from 'react';

// Sample task data - in a real app, this would be passed as props or fetched from an API
const sampleTasks = [
  { id: 1, title: 'Project Proposal', deadline: '2025-05-10', priority: 'high' },
  { id: 2, title: 'Client Meeting', deadline: '2025-05-05', priority: 'medium' },
  { id: 3, title: 'Report Submission', deadline: '2025-05-15', priority: 'high' },
  { id: 4, title: 'Team Check-in', deadline: '2025-05-07', priority: 'low' },
  { id: 5, title: 'Quarterly Review', deadline: '2025-05-20', priority: 'medium' },
  { id: 6, title: 'Budget Planning', deadline: '2025-05-25', priority: 'high' },
];

// Priority color mapping
const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});
  
  // Group tasks by their deadline date
  useEffect(() => {
    const groupedTasks = {};
    sampleTasks.forEach(task => {
      if (!groupedTasks[task.deadline]) {
        groupedTasks[task.deadline] = [];
      }
      groupedTasks[task.deadline].push(task);
    });
    setTasksByDate(groupedTasks);
  }, []);

  // Get month name and year
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Navigation functions
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calendar generation helpers
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Format date for task lookup
  const formatDateForLookup = (day) => {
    if (!day) return null;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  // Get tasks for a specific day
  const getTasksForDay = (day) => {
    if (!day) return [];
    const dateKey = formatDateForLookup(day);
    return tasksByDate[dateKey] || [];
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && 
                         today.getFullYear() === currentDate.getFullYear();
  const currentDay = today.getDate();

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setSelectedDayTasks(getTasksForDay(day));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{month} {year}</h2>
        <div className="flex space-x-2">
          <button onClick={previousMonth} className="p-2 rounded hover:bg-blue-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button onClick={nextMonth} className="p-2 rounded hover:bg-blue-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Calendar Body */}
      <div className="p-6">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="text-center font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const tasks = getTasksForDay(day);
            const isToday = isCurrentMonth && day === currentDay;
            const isSelected = day === selectedDay;
            
            return (
              <div 
                key={index} 
                className={`
                  min-h-24 p-2 border rounded 
                  ${!day ? 'bg-gray-50 border-gray-100' : 'border-gray-200 hover:bg-blue-50 cursor-pointer'} 
                  ${isToday ? 'border-blue-500 border-2' : ''}
                  ${isSelected ? 'bg-blue-50' : ''}
                `}
                onClick={() => day && handleDayClick(day)}
              >
                {day && (
                  <>
                    <div className="text-right mb-1">
                      <span className={`
                        inline-block rounded-full w-6 h-6 text-center leading-6
                        ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}
                      `}>
                        {day}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tasks.slice(0, 3).map(task => (
                        <div 
                          key={task.id} 
                          className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`}
                          title={task.title}
                        />
                      ))}
                      {tasks.length > 3 && (
                        <div className="text-xs text-gray-500 ml-1">+{tasks.length - 3}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Details Panel */}
      {selectedDay && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tasks for {month} {selectedDay}, {year}
          </h3>
          {selectedDayTasks.length > 0 ? (
            <ul className="space-y-3">
              {selectedDayTasks.map(task => (
                <li key={task.id} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                  <div className={`w-4 h-4 rounded-full mr-3 ${priorityColors[task.priority]}`}></div>
                  <span className="font-medium">{task.title}</span>
                  <span className="ml-auto text-sm text-gray-500 capitalize">{task.priority} priority</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tasks scheduled for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}