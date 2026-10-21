import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle, AlertCircle, Compass, Zap, HelpCircle } from 'lucide-react';
import { Course, StudentProfile } from '../types/academic';
import { analyzeCourseLeverage, analyzeTargetGoal, calculateCGPA } from '../utils/gradeCalculations';
import { getDegreeClass, GRADING_SCALES } from '../data/gradingScales';

interface ImprovementPlannerProps {
  profile: StudentProfile;
  onUpdateTarget: (newTarget: number) => void;
}

export const ImprovementPlanner: React.FC<ImprovementPlannerProps> = ({
  profile,
  onUpdateTarget,
}) => {
  const scale = GRADING_SCALES[profile.scaleType] || GRADING_SCALES.nuc_5_0;
  const cgpaResult = calculateCGPA(profile.semesters, profile.scaleType);

  // Target Goal Engine
  const targetAnalysis = analyzeTargetGoal(
    cgpaResult.cgpa,
    cgpaResult.totalTCU,
    profile.targetCGPA,
    profile.totalDegreeUnits || 140,
    profile.scaleType
  );

  // Interactive What-If Simulator for Upcoming Courses
  const [hypotheticalCourses, setHypotheticalCourses] = useState<Course[]>([
    { id: 'hyp-1', code: 'CORE 301', title: 'Advanced Core Course I', creditUnits: 4, grade: 'A' },
    { id: 'hyp-2', code: 'CORE 303', title: 'Departmental Methods', creditUnits: 3, grade: 'A' },
    { id: 'hyp-3', code: 'CORE 305', title: 'Research Methodology & Seminars', creditUnits: 3, grade: 'B' },
    { id: 'hyp-4', code: 'ELEC 307', title: 'Specialized Elective', creditUnits: 2, grade: 'A' },
  ]);

  // Compute hypothetical trajectory
  const hypTCP = hypotheticalCourses.reduce((sum, c) => {
    const pts = scale.grades.find(g => g.letter === c.grade)?.points || 0;
    return sum + (c.creditUnits * pts);
  }, 0);
  const hypTCU = hypotheticalCourses.reduce((sum, c) => sum + c.creditUnits, 0);

  const projectedTotalTCP = cgpaResult.totalTCP + hypTCP;
  const projectedTotalTCU = cgpaResult.totalTCU + hypTCU;
  const projectedCGPA = projectedTotalTCU > 0 ? Number((projectedTotalTCP / projectedTotalTCU).toFixed(2)) : 0;
  const projectedDegreeClass = getDegreeClass(projectedCGPA, profile.scaleType);
  const cgpaDelta = Number((projectedCGPA - cgpaResult.cgpa).toFixed(2));

  // Course Leverage on most recent semester
  const latestSemester = profile.semesters[profile.semesters.length - 1];
  const leverageRanking = latestSemester
    ? analyzeCourseLeverage(latestSemester.courses, profile.scaleType)
    : [];

  const updateHypGrade = (id: string, newGrade: string) => {
    setHypotheticalCourses(hypotheticalCourses.map(c => c.id === id ? { ...c, grade: newGrade } : c));
  };

  const updateHypUnits = (id: string, newUnits: number) => {
    setHypotheticalCourses(hypotheticalCourses.map(c => c.id === id ? { ...c, creditUnits: newUnits } : c));
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Title & Goal Adjuster */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>Academic Trajectory & Improvement Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Target CGPA & Grade Improvement Planner
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate your path to First Class Honours or 2:1 division. Analyze required semester GPAs and exploit high-leverage credit units.
          </p>
        </div>

        {/* Quick Target Changer */}
        <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-1" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target CGPA:</span>
          <select
            value={profile.targetCGPA}
            onChange={(e) => onUpdateTarget(parseFloat(e.target.value))}
            className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white"
          >
            {scale.maxPoints === 4.0 ? (
              <>
                <option value="3.50">3.50 (Distinction Minimum)</option>
                <option value="3.75">3.75 (High Distinction)</option>
                <option value="3.00">3.00 (Upper Credit)</option>
              </>
            ) : scale.maxPoints === 7.0 ? (
              <>
                <option value="6.00">6.00 (First Class UI)</option>
                <option value="6.50">6.50 (High First Class)</option>
                <option value="4.60">4.60 (Second Class Upper)</option>
              </>
            ) : (
              <>
                <option value="4.50">4.50 (First Class Threshold)</option>
                <option value="4.70">4.70 (High First Class)</option>
                <option value="4.00">4.00 (Strong 2:1)</option>
                <option value="3.50">3.50 (2:1 Division Minimum)</option>
                <option value="3.00">3.00 (2:2 Division)</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Target Analysis Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 bg-slate-900 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Current CGPA</span>
              <span className="text-4xl font-extrabold font-mono tabular-nums text-white mt-1 block">
                {cgpaResult.cgpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">{cgpaResult.degreeClass.name}</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Target Goal</span>
              <span className="text-4xl font-extrabold font-mono tabular-nums text-emerald-400 mt-1 block">
                {profile.targetCGPA.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Graduation Target</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Required Future GPA</span>
              <span className="text-4xl font-extrabold font-mono tabular-nums text-blue-400 mt-1 block">
                {targetAnalysis.isAchievable ? targetAnalysis.requiredRemainingGPA.toFixed(2) : 'N/A'}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Across remaining {targetAnalysis.remainingUnits} units</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Feasibility Verdict</span>
              <div className="mt-2">
                {targetAnalysis.difficulty === 'comfortable' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Comfortable Pace</span>
                  </span>
                )}
                {targetAnalysis.difficulty === 'challenging' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-800 px-2.5 py-1 rounded-md">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Challenging & Achievable</span>
                  </span>
                )}
                {targetAnalysis.difficulty === 'demanding' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-md">
                    <Zap className="w-3.5 h-3.5" />
                    <span>High Stakes (Requires Straight A&apos;s)</span>
                  </span>
                )}
                {targetAnalysis.difficulty === 'mathematically_impossible' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/60 border border-red-800 px-2.5 py-1 rounded-md">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Mathematically Out of Reach</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 mt-1.5 block">
                Max Possible CGPA: {targetAnalysis.maxPossibleCGPA.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Strategic Advice Notes */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Tailored Nigerian Academic Improvement Strategy
          </h3>
          <ul className="space-y-2">
            {targetAnalysis.strategicAdvice.map((advice, i) => (
              <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">&bull;</span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Part 2: Interactive What-If Scenario Builder */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            &ldquo;What-If&rdquo; Upcoming Semester Grade Simulator
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Toggle your expected grades for upcoming courses below and watch how your cumulative CGPA dynamically responds.
          </p>
        </div>

        {/* Hypothetical Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2 px-3">Course Code & Focus</th>
                <th className="py-2 px-3 text-center">Credit Units</th>
                <th className="py-2 px-3 text-center">Predicted Grade</th>
                <th className="py-2 px-3 text-right">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {hypotheticalCourses.map((c) => {
                const pts = scale.grades.find(g => g.letter === c.grade)?.points || 0;
                return (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                      <span className="font-mono font-bold mr-2">{c.code}</span>
                      <span className="text-xs text-slate-500">{c.title}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={c.creditUnits}
                        onChange={(e) => updateHypUnits(c.id, parseInt(e.target.value, 10))}
                        className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6].map(u => (
                          <option key={u} value={u}>{u} {u === 1 ? 'Unit' : 'Units'}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={c.grade}
                        onChange={(e) => updateHypGrade(c.id, e.target.value)}
                        className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-slate-900 dark:text-white cursor-pointer"
                      >
                        {scale.grades.map(g => (
                          <option key={g.letter} value={g.letter}>
                            Grade {g.letter} ({g.points} pts)
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs font-bold text-slate-900 dark:text-white">
                      {(c.creditUnits * pts).toFixed(1)} TCP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Projected Outcome Gauge Strip */}
        <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Projected Cumulative CGPA</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
                {projectedCGPA.toFixed(2)}
              </span>
              <span className={`text-xs font-bold font-mono ${cgpaDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {cgpaDelta >= 0 ? `+${cgpaDelta.toFixed(2)}` : cgpaDelta.toFixed(2)} shift
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Graduation Division: <strong className="text-emerald-400">{projectedDegreeClass.name}</strong>
            </span>
          </div>

          <div className="text-right text-xs text-slate-400">
            Based on completing these <span className="text-white font-mono font-bold">{hypTCU} units</span> with{' '}
            <span className="text-emerald-400 font-mono font-bold">{hypTCP.toFixed(1)} TCP</span>.
          </div>
        </div>
      </div>

      {/* Part 3: Course Leverage Sensitivity Analyzer */}
      {leverageRanking.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Sensitivity Analysis</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Course Leverage Ranking: Where to Invest Study Hours
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Not all courses are created equal. A 4-unit course carries 400% the weight of a 1-unit elective. Here is how your recent courses rank in CGPA leverage:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leverageRanking.map((cl, i) => (
              <div
                key={cl.courseId}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {cl.code}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {cl.creditUnits} {cl.creditUnits === 1 ? 'Unit' : 'Units'} ({cl.unitWeightPercent}% load)
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {cl.title}
                  </h3>

                  <div className="text-xs text-slate-500 mt-2">
                    Current Grade: <strong className="text-slate-800 dark:text-slate-200">{cl.currentGrade}</strong> ({cl.currentTCP.toFixed(1)} TCP)
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 block">Leverage Impact:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    +{cl.impactIfA.toFixed(2)} GPA
                  </span>{' '}
                  <span className="text-slate-500">if scored an &apos;A&apos;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
