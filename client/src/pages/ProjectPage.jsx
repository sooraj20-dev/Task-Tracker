import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Calendar, AlertCircle, Tag } from 'lucide-react';

export default function ProjectPage({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Tasks');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    setFilteredTasks(tasks.filter(task =>
      (!searchTerm || task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All Tasks' || task.status === statusFilter)
    ));
  }, [tasks, searchTerm, statusFilter]);

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const handleInputChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });
  const handleEditInputChange = (e) => setEditingTask({ ...editingTask, [e.target.name]: e.target.value });

  const handleCreateTask = () => {
    const newEntry = { ...newTask, id: `task-${Date.now()}`, creationDate: new Date().toISOString(), project_id: projectId };
    setTasks([...tasks, newEntry]);
    setNewTask({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' });
    setIsModalOpen(false);
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map(t => (t.id === editingTask.id ? editingTask : t)));
    setEditingTask(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteTask = (id) => confirm('Are you sure?') && setTasks(tasks.filter(t => t.id !== id));

  const badgeClass = (type, value) => {
    const map = {
      priority: { High: 'bg-red-100 text-red-800', Medium: 'bg-yellow-100 text-yellow-800', Low: 'bg-green-100 text-green-800' },
      status: { Completed: 'bg-green-100 text-green-800', 'In Progress': 'bg-blue-100 text-blue-800', Delayed: 'bg-red-100 text-red-800', Pending: 'bg-yellow-100 text-yellow-800' }
    };
    return map[type][value] || 'bg-gray-100 text-gray-800';
  };

  const renderModal = (isOpen, setIsOpen, task, setTask, handleSubmit, isEdit = false) => isOpen && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">{isEdit ? 'Edit Task' : 'Create New Task'}</h3>
          <button onClick={() => { setIsOpen(false); setTask(null); }} className="text-gray-400 hover:text-gray-500"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          {['title', 'description', 'dueDate'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">{field}</label>
              {field === 'description' ? (
                <textarea name={field} rows="3" value={task[field]} onChange={(e) => setTask({ ...task, [field]: e.target.value })} className="mt-1 w-full rounded-md border p-2" />
              ) : (
                <input type={field === 'dueDate' ? 'date' : 'text'} name={field} value={task[field]} onChange={(e) => setTask({ ...task, [field]: e.target.value })} className="mt-1 w-full rounded-md border p-2" required={field === 'title' || field === 'dueDate'} />
              )}
            </div>
          ))}
          {['priority', 'status'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">{field}</label>
              <select name={field} value={task[field]} onChange={(e) => setTask({ ...task, [field]: e.target.value })} className="mt-1 w-full rounded-md border p-2">
                {['High', 'Medium', 'Low', 'Pending', 'In Progress', 'Completed', 'Delayed'].filter(val => field === 'priority' ? ['High', 'Medium', 'Low'].includes(val) : true).map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          ))}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium">Creation Date</label>
              <div className="mt-1 flex items-center space-x-2 text-gray-600 bg-gray-50 p-3 rounded-md">
                <Calendar size={18} />
                <span>{formatDate(task.creationDate)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button onClick={() => { setIsOpen(false); setTask(null); }} className="mr-3 px-4 py-2 border rounded-md text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={!task.title || !task.dueDate} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">{isEdit ? 'Update' : 'Create'} Task</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ongoing Projects</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus size={18} className="mr-2" /> Create Task
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded-md" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2">
            {['All Tasks', 'In Progress', 'Pending', 'Completed', 'Delayed'].map(status => <option key={status}>{status}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length ? filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow-md border p-5 flex flex-col">
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => { setEditingTask(task); setIsEditModalOpen(true); }} className="text-blue-600"><Edit size={18} /></button>
                  <button onClick={() => handleDeleteTask(task.id)} className="text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{task.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${badgeClass('priority', task.priority)}`}><Tag size={12} className="mr-1" />{task.priority}</span>
                <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${badgeClass('status', task.status)}`}><AlertCircle size={12} className="mr-1" />{task.status}</span>
              </div>
              <div className="text-sm text-gray-500">
                <div className="flex items-center"><Calendar size={14} className="mr-1" />Created: {formatDate(task.creationDate)}</div>
                <div className="flex items-center"><Calendar size={14} className="mr-1" />Due: {formatDate(task.dueDate)}</div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-gray-500 py-12">
              <AlertCircle size={48} className="mb-3 mx-auto" />
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-sm">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </main>

      {renderModal(isModalOpen, setIsModalOpen, newTask, setNewTask, handleCreateTask)}
      {renderModal(isEditModalOpen, setIsEditModalOpen, editingTask, setEditingTask, handleUpdateTask, true)}
    </div>
  );
}
