import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, AlertTriangle, Sparkles, School, Layers, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, Semester, StudentProfile } from '../types/academic';
import { calculateCGPA } from '../utils/gradeCalculations';
import { GRADING_SCALES } from '../data/gradingScales';
import { DEPARTMENT_TEMPLATES } from '../data/presetData';

interface CGPAManagerProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onNavigateToTarget: () => void;
}

export const CGPAManager: React.FC<CGPAManagerProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToTarget,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [selectedPresetDept, setSelectedPresetDept] = useState('');

  const scaleConfig = GRADING_SCALES[profile.scaleType] || GRADING_SCALES.nuc_5_0;
  const cgpaResult = calculateCGPA(profile.semesters, profile.scaleType);

  const levelsAvailable = Array.from(new Set(profile.semesters.map(s => s.level))).sort((a, b) => a - b);
  const displayedSemesters = selectedLevelFilter === 'all'
    ? profile.semesters
    : profile.semesters.filter(s => s.level === selectedLevelFilter);

  // Count carryovers
  const carryovers = profile.semesters.flatMap(s => s.courses).filter(c => c.isCarryover || c.grade === 'F');

  const handleUpdateCourse = (semesterId: string, courseId: string, field: keyof Course, value: any) => {
    const updatedSemesters = profile.semesters.map(sem => {
      if (sem.id !== semesterId) return sem;
      const updatedCourses = sem.courses.map(c => {
        if (c.id !== courseId) return c;
        return { ...c, [field]: value };
      });
      return { ...sem, courses: updatedCourses };
    });
    onUpdateProfile({ ...profile, semesters: updatedSemesters });
  };

  const handleAddCourse = (semesterId: string) => {
    const updatedSemesters = profile.semesters.map(sem => {
      if (sem.id !== semesterId) return sem;
      const newCourse: Course = {
        id: `course-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        code: `CRS ${sem.courses.length + 1}01`,
        title: 'New Course',
        creditUnits: 3,
        grade: 'A',
      };
      return { ...sem, courses: [...sem.courses, newCourse] };
    });
    onUpdateProfile({ ...profile, semesters: updatedSemesters });
  };

  const handleRemoveCourse = (semesterId: string, courseId: string) => {
    const updatedSemesters = profile.semesters.map(sem => {
      if (sem.id !== semesterId) return sem;
      return { ...sem, courses: sem.courses.filter(c => c.id !== courseId) };
    });
    onUpdateProfile({ ...profile, semesters: updatedSemesters });
  };

  const handleAddSemester = () => {
    // Determine next level and semester
    const lastSem = profile.semesters[profile.semesters.length - 1];
    let nextLevel = 100;
    let nextSemNumber: 1 | 2 = 1;

    if (lastSem) {
      if (lastSem.semesterNumber === 1) {
        nextLevel = lastSem.level;
        nextSemNumber = 2;
      } else {
        nextLevel = lastSem.level + 100;
        nextSemNumber = 1;
      }
    }

    const newSemester: Semester = {
      id: `sem-${nextLevel}-${nextSemNumber}-${Date.now()}`,
      level: nextLevel,
      semesterNumber: nextSemNumber,
      name: `${nextLevel} Level — ${nextSemNumber === 1 ? '1st' : '2nd'} Semester`,
      courses: [
        { id: `c-${Date.now()}-1`, code: `CORE ${nextLevel}1`, title: 'Core Departmental Course I', creditUnits: 3, grade: 'A' },
        { id: `c-${Date.now()}-2`, code: `CORE ${nextLevel}2`, title: 'Core Departmental Course II', creditUnits: 3, grade: 'A' },
        { id: `c-${Date.now()}-3`, code: `ELEC ${nextLevel}1`, title: 'Faculty Elective', creditUnits: 2, grade: 'B' },
      ],
    };

    onUpdateProfile({
      ...profile,
      semesters: [...profile.semesters, newSemester],
    });
  };

  const handleRemoveSemester = (semesterId: string) => {
    if (profile.semesters.length <= 1) return;
    if (!window.confirm('Are you sure you want to remove this semester and all its recorded courses?')) return;
    onUpdateProfile({
      ...profile,
      semesters: profile.semesters.filter(s => s.id !== semesterId),
    });
  };

  const handleLoadTemplate = (deptName: string) => {
    const template = DEPARTMENT_TEMPLATES[deptName];
    if (!template) return;
    if (window.confirm(`Load standard curriculum template for ${deptName}? This will set up realistic courses for 100 & 200 Level.`)) {
      onUpdateProfile({
        ...profile,
        department: deptName,
        faculty: template.faculty,
        semesters: template.defaultSemesters,
      });
      setSelectedPresetDept('');
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#10b981', '#34d399', '#3b82f6'],
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Student Profile Quick Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white shrink-0">
              <School className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {profile.studentName || 'Student Profile'}
                </h1>
                <span className="text-xs text-slate-500 font-medium">
                  {profile.department} &bull; {profile.institutionName}
                </span>
              </div>

              {/* Unboxed metadata row with middle dot separators (Anti-Slop rule) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                <span>{profile.faculty || 'Faculty'}</span>
                <span aria-hidden="true">&bull;</span>
                <span>{profile.currentLevel} Level</span>
                <span aria-hidden="true">&bull;</span>
                <span>Scale: {scaleConfig.name.split('(')[0]}</span>
                <span aria-hidden="true">&bull;</span>
                <span>Target: {profile.targetCGPA.toFixed(2)} CGPA</span>
              </div>
            </div>
          </div>

          {/* Action controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {isEditingInfo ? 'Close Settings' : 'Edit Bio & Target'}
            </button>

            {/* Department Template Quick Dropdown */}
            <select
              value={selectedPresetDept}
              onChange={(e) => {
                setSelectedPresetDept(e.target.value);
                if (e.target.value) handleLoadTemplate(e.target.value);
              }}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="">Load Department Template...</option>
              {Object.keys(DEPARTMENT_TEMPLATES).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Inline Bio & Target Editing Drawer */}
        {isEditingInfo && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Full Name
              </label>
              <input
                type="text"
                value={profile.studentName}
                onChange={(e) => onUpdateProfile({ ...profile, studentName: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institution / University
              </label>
              <input
                type="text"
                value={profile.institutionName}
                onChange={(e) => onUpdateProfile({ ...profile, institutionName: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grading System Scale
              </label>
              <select
                value={profile.scaleType}
                onChange={(e) => onUpdateProfile({ ...profile, scaleType: e.target.value as any })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="nuc_5_0">NUC Standard 5.0 (A=5, B=4, C=3, D=2, F=0)</option>
                <option value="nuc_5_0_with_e">5.0 Scale with E (A, B, C, D, E, F)</option>
                <option value="poly_4_0">NBTE 4.0 Scale (Polytechnics / ND / HND)</option>
                <option value="ui_7_0">University of Ibadan 7.0 Scale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Graduation CGPA
              </label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max={scaleConfig.maxPoints}
                value={profile.targetCGPA}
                onChange={(e) => onUpdateProfile({ ...profile, targetCGPA: parseFloat(e.target.value) || 4.5 })}
                className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Hero CGPA Metric Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cumulative CGPA Card */}
        <div className="md:col-span-2 bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Cumulative CGPA (Current Standing)
            </span>
            {cgpaResult.isFirstClassPace && (
              <button
                onClick={triggerCelebration}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>First Class Pace!</span>
              </button>
            )}
          </div>

          <div className="my-3 flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-extrabold font-mono tabular-nums text-white">
              {cgpaResult.cgpa.toFixed(2)}
            </span>
            <span className="text-base text-slate-400 font-mono">
              / {scaleConfig.maxPoints.toFixed(2)}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Class of Degree:</span>{' '}
              <span className="text-sm font-bold text-emerald-400">{cgpaResult.degreeClass.name}</span>
            </div>
            <button
              onClick={onNavigateToTarget}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              Analyze Improvement Room &rarr;
            </button>
          </div>
        </div>

        {/* Total Registered Units (TCU) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Total Credit Units (TCU)
            </span>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
              {cgpaResult.totalTCU}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Across {cgpaResult.semestersCount} completed semesters
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Degree Requirement: ~{profile.totalDegreeUnits} units
          </div>
        </div>

        {/* Quality Points (TCP) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Total Quality Points (TCP)
            </span>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-2">
              {cgpaResult.totalTCP.toFixed(1)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Points earned via course grades
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Formula: {cgpaResult.totalTCP.toFixed(1)} &divide; {cgpaResult.totalTCU || 1} = {cgpaResult.cgpa.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Carryover warning alert if any exist */}
      {carryovers.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold">Carryover Alert:</span> You have {carryovers.length} course(s) marked as carryover or F grade ({carryovers.map(c => c.code).join(', ')}). In Nigerian universities, re-registering and acing carryovers with an &apos;A&apos; replaces zero quality points with 15 Quality Points (for a 3-unit course), significantly lifting your CGPA.
          </div>
        </div>
      )}

      {/* Level Filter Tabs + Add Semester */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedLevelFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedLevelFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
            }`}
          >
            All Semesters ({profile.semesters.length})
          </button>
          {levelsAvailable.map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevelFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedLevelFilter === lvl
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {lvl} Level
            </button>
          ))}
        </div>

        <button
          onClick={handleAddSemester}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Semester</span>
        </button>
      </div>

      {/* Semesters Cards List */}
      <div className="space-y-6">
        {displayedSemesters.map((semester) => {
          const semRes = cgpaResult.semesterResults.find(r => r.semesterId === semester.id);
          const semGPA = semRes ? semRes.gpa : 0.0;
          const semTCU = semRes ? semRes.tcu : 0;
          const semTCP = semRes ? semRes.tcp : 0;
          const cumulativeToDate = semRes ? semRes.cumulativeCGPA : 0.0;

          return (
            <div
              key={semester.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Semester Header Strip */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {semester.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded">
                      GPA: {semGPA.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{semTCU} Credit Units</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>{semTCP.toFixed(1)} Credit Points</span>
                    <span aria-hidden="true">&bull;</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      Cumulative CGPA at this stage: {cumulativeToDate.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddCourse(semester.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Course</span>
                  </button>

                  {profile.semesters.length > 1 && (
                    <button
                      onClick={() => handleRemoveSemester(semester.id)}
                      title="Delete Semester"
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Courses Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-2 px-3">Course Code</th>
                        <th className="py-2 px-3">Course Title</th>
                        <th className="py-2 px-3 text-center">Credit Units</th>
                        <th className="py-2 px-3 text-center">Grade Letter</th>
                        <th className="py-2 px-3 text-right">Points</th>
                        <th className="py-2 px-3 text-center">Carryover?</th>
                        <th className="py-2 px-3 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                      {semester.courses.map((course) => {
                        const gradeObj = scaleConfig.grades.find(g => g.letter === course.grade);
                        const points = gradeObj ? gradeObj.points : 0;
                        const rowTCP = course.creditUnits * points;

                        return (
                          <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={course.code}
                                onChange={(e) => handleUpdateCourse(semester.id, course.id, 'code', e.target.value)}
                                className="w-24 text-xs font-mono font-bold uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                              />
                            </td>

                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={course.title}
                                onChange={(e) => handleUpdateCourse(semester.id, course.id, 'title', e.target.value)}
                                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                              />
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <select
                                value={course.creditUnits}
                                onChange={(e) => handleUpdateCourse(semester.id, course.id, 'creditUnits', parseInt(e.target.value, 10))}
                                className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                              >
                                {[1, 2, 3, 4, 5, 6].map(u => (
                                  <option key={u} value={u}>{u} {u === 1 ? 'Unit' : 'Units'}</option>
                                ))}
                              </select>
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <select
                                value={course.grade}
                                onChange={(e) => handleUpdateCourse(semester.id, course.id, 'grade', e.target.value)}
                                className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                              >
                                {scaleConfig.grades.map(g => (
                                  <option key={g.letter} value={g.letter}>
                                    {g.letter} ({g.points} pts)
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs font-semibold text-slate-900 dark:text-white">
                              {rowTCP.toFixed(1)}
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={course.isCarryover || false}
                                onChange={(e) => handleUpdateCourse(semester.id, course.id, 'isCarryover', e.target.checked)}
                                className="rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                              />
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => handleRemoveCourse(semester.id, course.id)}
                                disabled={semester.courses.length <= 1}
                                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
