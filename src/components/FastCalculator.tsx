import React, { useState } from 'react';
import { Plus, Trash2, Calculator, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, GradingScaleType } from '../types/academic';
import { calculateSemesterGPA } from '../utils/gradeCalculations';
import { getDegreeClass, GRADING_SCALES, scoreToGrade } from '../data/gradingScales';

interface FastCalculatorProps {
  scaleType: GradingScaleType;
  onSaveToProfile?: (courses: Course[], semesterName: string) => void;
}

export const FastCalculator: React.FC<FastCalculatorProps> = ({ scaleType, onSaveToProfile }) => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', code: 'CSC 101', title: 'Intro to Computer Science', creditUnits: 3, grade: 'A', score: 78 },
    { id: '2', code: 'MTH 101', title: 'Elementary Mathematics I', creditUnits: 4, grade: 'B', score: 65 },
    { id: '3', code: 'PHY 101', title: 'General Physics I', creditUnits: 3, grade: 'A', score: 72 },
    { id: '4', code: 'GST 101', title: 'Use of English', creditUnits: 2, grade: 'A', score: 80 },
  ]);

  const [inputMode, setInputMode] = useState<'grade' | 'score'>('grade');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const scale = GRADING_SCALES[scaleType] || GRADING_SCALES.nuc_5_0;
  const result = calculateSemesterGPA(courses, scaleType);
  const degreeClass = getDegreeClass(result.gpa, scaleType);

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      code: `COURSE ${courses.length + 1}`,
      title: 'Course Title',
      creditUnits: 3,
      grade: 'A',
      score: 75,
    };
    setCourses([...courses, newCourse]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, [field]: value };
      if (field === 'score') {
        const num = parseFloat(value) || 0;
        updated.score = num;
        updated.grade = scoreToGrade(num, scaleType);
      }
      return updated;
    }));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#059669', '#10b981', '#34d399', '#6ee7b7'],
    });
  };

  const handleCalculateAndCelebrate = () => {
    if (result.gpa >= 4.50 || (scaleType === 'poly_4_0' && result.gpa >= 3.50)) {
      triggerConfetti();
    }
  };

  const handleReset = () => {
    setCourses([
      { id: '1', code: 'GST 101', title: 'Course 1', creditUnits: 3, grade: 'A', score: 75 },
      { id: '2', code: 'MTH 101', title: 'Course 2', creditUnits: 3, grade: 'B', score: 65 },
    ]);
  };

  const handleSave = () => {
    if (onSaveToProfile) {
      onSaveToProfile(courses, `Quick Calculated (${new Date().toLocaleDateString()})`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fast Semester GPA Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Instant scratchpad calculation for any Nigerian university semester. Enter courses by letter grade or exam percentage.
          </p>
        </div>

        {/* Input mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setInputMode('grade')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              inputMode === 'grade'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Letter Grades
          </button>
          <button
            onClick={() => setInputMode('score')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              inputMode === 'score'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Exam Marks (0–100%)
          </button>
        </div>
      </div>

      {/* Main Calculation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Results Banner */}
        <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Semester GPA</span>
              <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-white">
                {result.gpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">out of {scale.maxPoints.toFixed(1)}</span>
            </div>

            <div className="h-10 w-px bg-slate-800 hidden sm:block" />

            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Academic Division</span>
              <span className="text-lg font-bold text-emerald-400 block">
                {degreeClass.name}
              </span>
              <span className="text-xs text-slate-400">Class Standing: {degreeClass.badge}</span>
            </div>

            <div className="h-10 w-px bg-slate-800 hidden sm:block" />

            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Credit Balance</span>
              <div className="text-sm font-mono tabular-nums text-slate-200 mt-1">
                <span className="text-blue-400 font-bold">{result.tcu}</span> Total Units (TCU) &bull;{' '}
                <span className="text-emerald-400 font-bold">{result.tcp.toFixed(1)}</span> Points (TCP)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCalculateAndCelebrate}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Verify Standing
            </button>
          </div>
        </div>

        {/* Table of courses */}
        <div className="p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2 px-3">Course Code</th>
                  <th className="py-2 px-3">Course Title</th>
                  <th className="py-2 px-3 text-center">Credit Units</th>
                  <th className="py-2 px-3 text-center">
                    {inputMode === 'score' ? 'Exam Mark (0–100%)' : 'Letter Grade'}
                  </th>
                  <th className="py-2 px-3 text-right">Points</th>
                  <th className="py-2 px-3 text-center w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {courses.map((course) => {
                  return (
                    <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={course.code}
                          onChange={(e) => handleUpdate(course.id, 'code', e.target.value)}
                          placeholder="e.g. MTH 101"
                          className="w-28 text-xs font-mono font-bold uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={course.title}
                          onChange={(e) => handleUpdate(course.id, 'title', e.target.value)}
                          placeholder="e.g. Elementary Calculus"
                          className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={course.creditUnits}
                          onChange={(e) => handleUpdate(course.id, 'creditUnits', parseInt(e.target.value, 10))}
                          className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map(u => (
                            <option key={u} value={u}>{u} {u === 1 ? 'Unit' : 'Units'}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        {inputMode === 'score' ? (
                          <div className="inline-flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={course.score ?? 70}
                              onChange={(e) => handleUpdate(course.id, 'score', e.target.value)}
                              className="w-16 text-center font-mono text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-slate-900 dark:text-white"
                            />
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono w-6">
                              ({course.grade})
                            </span>
                          </div>
                        ) : (
                          <select
                            value={course.grade}
                            onChange={(e) => handleUpdate(course.id, 'grade', e.target.value)}
                            className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                          >
                            {scale.grades.map(g => (
                              <option key={g.letter} value={g.letter}>
                                {g.letter} ({g.points} pts - {g.minScore}–{g.maxScore}%)
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white text-xs">
                        {(course.creditUnits * (scale.grades.find(g => g.letter === course.grade)?.points || 0)).toFixed(1)}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleRemoveCourse(course.id)}
                          disabled={courses.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddCourse}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Course</span>
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {onSaveToProfile && (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Saved to Academic Profile!</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>Save to Semester History</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
