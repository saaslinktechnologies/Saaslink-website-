import React, { useState } from 'react';
import { 
  FolderKanban, Plus, CheckCircle2, Clock, 
  AlertCircle, Users, Calendar, ArrowRight, 
  Trash2, Edit, CheckSquare, Square, ChevronRight 
} from 'lucide-react';
import { Project, Client, ProjectTask, TaskStatus, ProjectStatus } from '../../types.ts';

interface ProjectsViewProps {
  projects?: Project[];
  clients?: Client[];
  onCreateProject: (data: any) => Promise<void>;
  onUpdateProject: (id: string, data: any) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onAddTask: (projectId: string, task: any) => Promise<void>;
  onUpdateTask: (projectId: string, taskId: string, updates: any) => Promise<void>;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects = [],
  clients = [],
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onAddTask,
  onUpdateTask,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const safeProjects = projects || [];
  const safeClients = clients || [];

  // New Project Form
  const [name, setName] = useState('');
  const [code, setCode] = useState(`PRJ-${Date.now().toString().slice(-4)}`);
  const [clientId, setClientId] = useState(safeClients[0]?.id || '');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(12000);
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 86400000).toISOString().substring(0, 10));

  // New Task Form in Drawer
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [taskAssignee, setTaskAssignee] = useState('Senior Full-Stack Engineer');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateProject({
      name,
      code,
      clientId,
      description,
      status: 'Active',
      budget: Number(budget),
      startDate,
      endDate,
    });
    setCreateModalOpen(false);
  };

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !taskTitle.trim()) return;

    await onAddTask(selectedProject.id, {
      title: taskTitle,
      status: 'To Do',
      priority: taskPriority,
      assignedTo: taskAssignee,
    });

    setTaskTitle('');
    // Refresh selected project in local state
    const updatedProj = projects.find(p => p.id === selectedProject.id);
    if (updatedProj) setSelectedProject(updatedProj);
  };

  const handleToggleTaskStatus = async (task: ProjectTask) => {
    if (!selectedProject) return;
    const nextStatus: TaskStatus = 
      task.status === 'Completed' ? 'To Do' :
      task.status === 'To Do' ? 'In Progress' : 'Completed';

    await onUpdateTask(selectedProject.id, task.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Engineering Projects & Sprints
          </h2>
          <p className="text-xs text-slate-400">
            Monitor deliverables, task milestones, and budget burn-rates across client contracts.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {safeProjects.map((proj) => {
          const tasks = proj.tasks || [];
          const completedTasks = tasks.filter(t => t.status === 'Completed').length;
          const totalTasks = tasks.length;

          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`p-6 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                selectedProject?.id === proj.id
                  ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80">
                    {proj.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    proj.status === 'Active' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                    proj.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-white mb-1">
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{proj.clientCompany}</p>
                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {proj.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Milestones Progress</span>
                    <span className="font-mono text-cyan-300 font-bold">{proj.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <span className="text-[10px] block text-slate-500">Tasks: {completedTasks}/{totalTasks}</span>
                  <span className="font-mono text-slate-200">${proj.spent.toLocaleString()} / ${proj.budget.toLocaleString()}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(proj);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium flex items-center gap-1"
                >
                  <span>Sprints</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Tasks & Details Drawer */}
      {selectedProject && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  {selectedProject.code} • {selectedProject.status}
                </span>
                <h3 className="text-xl font-display font-bold text-white mt-0.5">
                  {selectedProject.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedProject.clientCompany}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Total Budget</span>
                <span className="font-mono font-bold text-white">${selectedProject.budget.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Burned</span>
                <span className="font-mono font-bold text-cyan-400">${selectedProject.spent.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Target Launch</span>
                <span className="text-slate-300">{selectedProject.endDate || 'TBD'}</span>
              </div>
            </div>

            {/* Add Task Quick Form */}
            <form onSubmit={handleCreateTaskSubmit} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono block">
                Add Engineering Task
              </span>

              <input
                type="text"
                required
                placeholder="Task title (e.g. Implement MySQL foreign key constraints)..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none"
                >
                  <option value="Low">Priority: Low</option>
                  <option value="Medium">Priority: Medium</option>
                  <option value="High">Priority: High</option>
                  <option value="Urgent">Priority: Urgent</option>
                </select>

                <input
                  type="text"
                  placeholder="Assignee (e.g. Lead Architect)"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>

            {/* Tasks List */}
            {(() => {
              const projectTasks = selectedProject.tasks || [];
              return (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Sprint Task Backlog ({projectTasks.length})
                  </h4>

                  {projectTasks.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-3">No tasks defined for this project yet.</p>
                  ) : (
                    projectTasks.map((task) => {
                  const isDone = task.status === 'Completed';
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTaskStatus(task)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                        isDone 
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-60' 
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <button className="mt-0.5 text-cyan-400">
                        {isDone ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                          <span className={`px-1.5 py-0.2 rounded font-semibold ${
                            task.priority === 'Urgent' ? 'bg-rose-950 text-rose-300' :
                            task.priority === 'High' ? 'bg-amber-950 text-amber-300' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {task.priority}
                          </span>
                          <span>•</span>
                          <span>{task.assignedTo}</span>
                          <span>•</span>
                          <span className="text-cyan-400">{task.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            );
            })()}

          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-left">
            <h3 className="text-lg font-display font-bold text-white mb-4">
              Initiate New Client Project
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PropLink Property Management Portal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Account *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.company}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Scope & Architecture Summary</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Technical scope, deliverables, and architecture..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Budget ($)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
