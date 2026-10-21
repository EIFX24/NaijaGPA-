import React, { useState } from 'react';
import { Calendar, Plus, Download, CheckCircle2, Clock, MapPin, AlertCircle, Trash2, ExternalLink } from 'lucide-react';
import { AcademicDeadline, DeadlineType } from '../types/academic';
import { createGoogleCalendarUrl, downloadICalendarFile } from '../utils/calendarExport';

interface DeadlineCalendarProps {
  deadlines: AcademicDeadline[];
  onUpdateDeadlines: (updated: AcademicDeadline[]) => void;
  institutionName?: string;
}

export const DeadlineCalendar: React.FC<DeadlineCalendarProps> = ({
  deadlines,
  onUpdateDeadlines,
  institutionName = 'University of Lagos',
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Partial<AcademicDeadline>>({
    courseCode: '',
    title: '',
    type: 'ca_test',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    venue: '',
    notes: '',
  });

  const filteredDeadlines = deadlines.filter((d) => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Check for upcoming deadlines in next 7 days
  const now = new Date();
  const next7Days = new Date();
  next7Days.setDate(now.getDate() + 7);

  const urgentDeadlines = deadlines.filter(d => {
    if (d.completed) return false;
    const target = new Date(d.date);
    return target >= now && target <= next7Days;
  });

  const handleToggleComplete = (id: string) => {
    onUpdateDeadlines(
      deadlines.map(d => d.id === id ? { ...d, completed: !d.completed } : d)
    );
  };

  const handleDelete = (id: string) => {
    onUpdateDeadlines(deadlines.filter(d => d.id !== id));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadline.courseCode || !newDeadline.title || !newDeadline.date) return;

    const created: AcademicDeadline = {
      id: `dl-${Date.now()}`,
      courseCode: newDeadline.courseCode.toUpperCase(),
      title: newDeadline.title,
      type: (newDeadline.type as DeadlineType) || 'ca_test',
      date: newDeadline.date,
      time: newDeadline.time,
      venue: newDeadline.venue,
      notes: newDeadline.notes,
      completed: false,
    };

    onUpdateDeadlines([...deadlines, created]);
    setIsAdding(false);
    setNewDeadline({
      courseCode: '',
      title: '',
      type: 'ca_test',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      venue: '',
      notes: '',
    });
  };

  const getDaysRemainingText = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Academic Schedule & Exam Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upcoming Deadlines & Exam Timetable
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track continuous assessment (CA) tests, term papers, and final exams. Sync seamlessly with your phone or Google Calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => downloadICalendarFile(deadlines, institutionName)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Phone/iCal (.ics)</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Cancel' : 'Add New Deadline'}</span>
          </button>
        </div>
      </div>

      {/* Urgent Notification Banner if deadlines within 7 days */}
      {urgentDeadlines.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold">Urgent Academic Reminder:</span> You have {urgentDeadlines.length} scheduled assessment(s) coming up within the next 7 days ({urgentDeadlines.map(d => `${d.courseCode} on ${d.date}`).join(', ')}). Protect your Continuous Assessment marks!
          </div>
        </div>
      )}

      {/* Add New Deadline Form Drawer */}
      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Schedule New Exam / Continuous Assessment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                placeholder="e.g. CSC 202"
                required
                value={newDeadline.courseCode}
                onChange={(e) => setNewDeadline({ ...newDeadline, courseCode: e.target.value })}
                className="w-full text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assessment Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Mid-Semester 30 Marks Test"
                required
                value={newDeadline.title}
                onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assessment Type
              </label>
              <select
                value={newDeadline.type}
                onChange={(e) => setNewDeadline({ ...newDeadline, type: e.target.value as any })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="ca_test">Continuous Assessment (CA) Test</option>
                <option value="exam">Semester Final Examination</option>
                <option value="assignment">Assignment / Term Paper</option>
                <option value="project_defense">Project Presentation / Defense</option>
                <option value="course_reg">Course Registration Deadline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={newDeadline.date}
                onChange={(e) => setNewDeadline({ ...newDeadline, date: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={newDeadline.time}
                onChange={(e) => setNewDeadline({ ...newDeadline, time: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Venue / Hall
              </label>
              <input
                type="text"
                placeholder="e.g. Faculty Lecture Theatre A"
                value={newDeadline.venue}
                onChange={(e) => setNewDeadline({ ...newDeadline, venue: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Key Notes / Topics Covered
              </label>
              <input
                type="text"
                placeholder="e.g. Modules 1-4, Bring student ID & scientific calculator"
                value={newDeadline.notes}
                onChange={(e) => setNewDeadline({ ...newDeadline, notes: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Schedule
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'ca_test', label: 'CA Tests' },
          { id: 'exam', label: 'Final Exams' },
          { id: 'assignment', label: 'Assignments' },
          { id: 'project_defense', label: 'Defenses' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilterType(item.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterType === item.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {filteredDeadlines.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">No scheduled deadlines found in this category.</p>
          </div>
        ) : (
          filteredDeadlines.map((item) => {
            const daysRemaining = getDaysRemainingText(item.date);
            const isUrgent = daysRemaining.includes('Today') || daysRemaining.includes('Tomorrow') || daysRemaining.includes('In 2') || daysRemaining.includes('In 3');
            const googleCalUrl = createGoogleCalendarUrl(item);

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.completed
                    ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(item.id)}
                      className={`mt-1 p-1 rounded-md transition-colors cursor-pointer ${
                        item.completed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-300 dark:text-slate-700 hover:text-slate-500'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {item.courseCode}
                        </span>
                        <h3 className={`text-sm font-bold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.title}
                        </h3>
                        <span className="text-xs text-slate-500">
                          &bull; {item.type.toUpperCase().replace('_', ' ')}
                        </span>
                      </div>

                      {/* Info row with unboxed text separators (Anti-Slop) */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                        </div>
                        {item.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.time}</span>
                          </div>
                        )}
                        {item.venue && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.venue}</span>
                          </div>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-500 mt-2 italic">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Countdown */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isUrgent && !item.completed
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.completed ? 'Completed' : daysRemaining}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Add to Google Calendar"
                        className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Google Cal</span>
                      </a>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Deadline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
