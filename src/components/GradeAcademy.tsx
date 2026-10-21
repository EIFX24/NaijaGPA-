import React, { useState } from 'react';
import { BookOpen, AlertCircle, ArrowRight, Lightbulb, GraduationCap } from 'lucide-react';
import { GRADING_SCALES } from '../data/gradingScales';
import { GradingScaleType } from '../types/academic';

interface GradeAcademyProps {
  onStartCalculating: () => void;
}

export const GradeAcademy: React.FC<GradeAcademyProps> = ({ onStartCalculating }) => {
  const [selectedScale, setSelectedScale] = useState<GradingScaleType>('nuc_5_0');

  // Interactive Equation Sandbox State
  const [sandboxCourses, setSandboxCourses] = useState([
    { name: 'MTH 101 (Calculus)', units: 4, grade: 'A', points: 5 },
    { name: 'PHY 101 (Physics)', units: 3, grade: 'B', points: 4 },
    { name: 'GST 101 (Use of English)', units: 2, grade: 'A', points: 5 },
    { name: 'PHY 107 (Practical)', units: 1, grade: 'C', points: 3 },
  ]);

  // Myth Buster State
  const [sem1Units, setSem1Units] = useState(24);
  const [sem1GPA, setSem1GPA] = useState(4.50);
  const [sem2Units, setSem2Units] = useState(14);
  const [sem2GPA, setSem2GPA] = useState(3.20);

  // Myth Buster Calculations
  const sem1TCP = sem1Units * sem1GPA;
  const sem2TCP = sem2Units * sem2GPA;
  const trueCGPA = (sem1TCP + sem2TCP) / (sem1Units + sem2Units);
  const naiveAverage = (sem1GPA + sem2GPA) / 2;
  const mythDifference = Math.abs(trueCGPA - naiveAverage);

  // Sandbox Calculations
  const totalUnits = sandboxCourses.reduce((sum, c) => sum + c.units, 0);
  const totalPoints = sandboxCourses.reduce((sum, c) => sum + (c.units * c.points), 0);
  const calculatedGPA = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';

  const updateSandboxGrade = (index: number, newGrade: string) => {
    const scale = GRADING_SCALES[selectedScale];
    const gradeObj = scale.grades.find(g => g.letter === newGrade) || scale.grades[0];
    const updated = [...sandboxCourses];
    updated[index] = { ...updated[index], grade: newGrade, points: gradeObj.points };
    setSandboxCourses(updated);
  };

  const updateSandboxUnits = (index: number, newUnits: number) => {
    const updated = [...sandboxCourses];
    updated[index] = { ...updated[index], units: Math.max(1, Math.min(6, newUnits)) };
    setSandboxCourses(updated);
  };

  const currentScaleConfig = GRADING_SCALES[selectedScale];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Explainer with High Quality Editorial Photography */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-3">
                <BookOpen className="w-4 h-4" />
                <span>Demystifying The Mathematics of Nigerian University Grades</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                Understand How Your GPA & CGPA Are Truly Calculated.
              </h1>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                From University of Lagos to Ahmadu Bello University, Nigerian institutions use weighted credit units—not simple averages. Master the formulas, avoid costly mistakes, and take control of your academic destiny.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartCalculating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
              >
                <span>Calculate Your CGPA Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400">
                Official NUC & NBTE Benchmark Formulations
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_student_academic_1792601204147.jpg"
              alt="Nigerian university student studying in library"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Part 1: The Core Two Formulas Explained Step-by-Step */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            01. The Two Core Formulas Every Nigerian Student Must Know
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Grading in Nigerian universities revolves around Quality Points (Total Credit Points) divided by Credit Units.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formula 1: GPA */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Single Semester
                </span>
                <span className="text-xs text-slate-500 font-mono">Formula A</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                GPA (Grade Point Average)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Calculates your performance in one specific semester. Each course&apos;s credit unit is multiplied by the numerical value of your grade.
              </p>

              {/* Formula Visual Box */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-mono">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  GPA = <span className="text-emerald-600 dark:text-emerald-400">Total Credit Points (TCP)</span> / <span className="text-blue-600 dark:text-blue-400">Total Credit Units (TCU)</span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  TCP = &Sigma; (Credit Units &times; Grade Points)
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <div>&bull; <strong>Credit Unit (CU):</strong> The course weight (e.g., 3 units).</div>
              <div>&bull; <strong>Grade Value:</strong> A=5, B=4, C=3, D=2, F=0 (NUC Scale).</div>
            </div>
          </div>

          {/* Formula 2: CGPA */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Cumulative Career
                </span>
                <span className="text-xs text-slate-500 font-mono">Formula B</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                CGPA (Cumulative Grade Point Average)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Represents your total standing from 100 Level Semester 1 up to your current semester. It combines all credit points over all registered units.
              </p>

              {/* Formula Visual Box */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-mono">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  CGPA = <span className="text-blue-600 dark:text-blue-400">&Sigma; All Semester TCPs</span> / <span className="text-emerald-600 dark:text-emerald-400">&Sigma; All Semester TCUs</span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Cumulative TCP / Cumulative TCU
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <div>&bull; <strong>Never Average GPAs:</strong> Averaging two semester GPAs is only correct if total units were identical.</div>
              <div>&bull; <strong>Carryover impact:</strong> F grades add 0 points but remain in your total TCU denominator.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Interactive Sandbox Table */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              02. Live Interactive Grade Calculation Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Change the units and letter grades below to see how the mathematics unfolds in real time.
            </p>
          </div>

          {/* Scale Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Grading Scale:</span>
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value as GradingScaleType)}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="nuc_5_0">NUC Standard 5.0 (A=5, B=4, C=3, D=2, F=0)</option>
              <option value="nuc_5_0_with_e">5.0 Scale with E (A, B, C, D, E, F)</option>
              <option value="poly_4_0">NBTE 4.0 Scale (Polytechnics)</option>
              <option value="ui_7_0">University of Ibadan 7.0 Scale</option>
            </select>
          </div>
        </div>

        {/* Table of courses */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Course Code & Title</th>
                <th className="py-3 px-3 text-center">Credit Units (CU)</th>
                <th className="py-3 px-3 text-center">Grade Letter</th>
                <th className="py-3 px-3 text-center">Grade Point</th>
                <th className="py-3 px-3 text-right">Credit Points (CU &times; GP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {sandboxCourses.map((c, idx) => {
                const rowTCP = c.units * c.points;
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                      {c.name}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => updateSandboxUnits(idx, c.units - 1)}
                          disabled={c.units <= 1}
                          className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono tabular-nums font-bold w-6 text-center">
                          {c.units}
                        </span>
                        <button
                          onClick={() => updateSandboxUnits(idx, c.units + 1)}
                          disabled={c.units >= 6}
                          className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <select
                        value={c.grade}
                        onChange={(e) => updateSandboxGrade(idx, e.target.value)}
                        className="font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white cursor-pointer"
                      >
                        {currentScaleConfig.grades.map(g => (
                          <option key={g.letter} value={g.letter}>
                            {g.letter} ({g.points} pts)
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {c.points.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      {rowTCP.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculation Result Breakdown Strip */}
        <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Total Units (TCU)</span>
              <span className="font-mono tabular-nums font-bold text-lg text-blue-400">{totalUnits}</span>
            </div>
            <div className="text-slate-600 font-bold">/</div>
            <div>
              <span className="text-slate-400 block text-xs">Total Points (TCP)</span>
              <span className="font-mono tabular-nums font-bold text-lg text-emerald-400">{totalPoints.toFixed(1)}</span>
            </div>
            <div className="text-slate-600 font-bold">=</div>
            <div>
              <span className="text-slate-400 block text-xs">Resulting GPA</span>
              <span className="font-mono tabular-nums font-extrabold text-2xl text-white">{calculatedGPA}</span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            Formula executed: <span className="font-mono text-white">{totalPoints.toFixed(1)} &divide; {totalUnits} = {calculatedGPA}</span>
          </div>
        </div>
      </section>

      {/* Part 3: The Myth Buster: Why Simple Averaging Is A Trap */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Lightbulb className="w-4 h-4" />
            <span>Interactive Myth Buster</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            03. The Great Fallacy: &ldquo;Why Can&apos;t I Just Average My Semester GPAs?&rdquo;
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Many Nigerian students mistakenly calculate: (Semester 1 GPA + Semester 2 GPA) / 2.
            This gives a mathematically false result whenever the two semesters have unequal credit units! Try adjusting the sliders below:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {/* Semester 1 Controls */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Semester 1 (Heavy Load)
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Credit Units:</span>
                <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">{sem1Units} Units</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={sem1Units}
                onChange={(e) => setSem1Units(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Semester 1 GPA:</span>
                <span className="font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">{sem1GPA.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.05"
                value={sem1GPA}
                onChange={(e) => setSem1GPA(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Semester 2 Controls */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Semester 2 (Lighter Load)
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Credit Units:</span>
                <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">{sem2Units} Units</span>
              </div>
              <input
                type="range"
                min="6"
                max="30"
                value={sem2Units}
                onChange={(e) => setSem2Units(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Semester 2 GPA:</span>
                <span className="font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">{sem2GPA.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.05"
                value={sem2GPA}
                onChange={(e) => setSem2GPA(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Flawed Simple Average</span>
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums text-red-700 dark:text-red-400">
              {naiveAverage.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Calculated as: ({sem1GPA.toFixed(2)} + {sem2GPA.toFixed(2)}) &divide; 2. Ignores that Semester 1 has {sem1Units} units while Semester 2 has only {sem2Units} units!
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>True NUC Weighted CGPA</span>
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              {trueCGPA.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Calculated as: ({sem1TCP.toFixed(1)} + {sem2TCP.toFixed(1)}) &divide; ({sem1Units} + {sem2Units}). Discrepancy of {mythDifference.toFixed(2)} points!
            </div>
          </div>
        </div>
      </section>

      {/* Part 4: Degree Classifications Guide Table */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            04. Nigerian Degree Classifications & Thresholds
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Understanding the cut-off marks for graduation honours under the National Universities Commission (NUC).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentScaleConfig.degreeClasses.map((dc, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: dc.color }}
                  >
                    {dc.badge}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    {dc.minCGPA.toFixed(2)} &ndash; {dc.maxCGPA.toFixed(2)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {dc.name}
                </h3>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                {dc.minCGPA >= 4.5 ? (
                  <span>Eligible for university commendation, scholarship nominations, and Dean&apos;s Honours List.</span>
                ) : dc.minCGPA >= 3.5 ? (
                  <span>Strong academic standing. Highly competitive for postgraduate studies and corporate graduate schemes.</span>
                ) : dc.minCGPA >= 2.4 ? (
                  <span>Standard passing division. Room for improvement into 2:1 division with targeted credit leverage.</span>
                ) : (
                  <span>Risk zone. Must maintain minimum semester threshold to avoid institutional academic probation.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
