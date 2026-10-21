import React from 'react';
import { BarChart3, TrendingUp, Award, CheckCircle2, Trophy } from 'lucide-react';
import { StudentProfile } from '../types/academic';
import { calculateCGPA } from '../utils/gradeCalculations';
import { GRADING_SCALES } from '../data/gradingScales';

interface AnalyticsDashboardProps {
  profile: StudentProfile;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ profile }) => {
  const scale = GRADING_SCALES[profile.scaleType] || GRADING_SCALES.nuc_5_0;
  const cgpaResult = calculateCGPA(profile.semesters, profile.scaleType);

  // Compute Grade distribution
  const allCourses = profile.semesters.flatMap(s => s.courses).filter(c => c.grade);
  const totalCourses = allCourses.length;
  const gradeCounts: Record<string, number> = {};

  scale.grades.forEach(g => {
    gradeCounts[g.letter] = 0;
  });

  allCourses.forEach(c => {
    const l = c.grade.toUpperCase();
    if (gradeCounts[l] !== undefined) {
      gradeCounts[l] += 1;
    }
  });

  // Degree units progress
  const unitsTarget = profile.totalDegreeUnits || 140;
  const unitsDone = cgpaResult.totalTCU;
  const progressPercent = Math.min(100, Math.round((unitsDone / unitsTarget) * 100));

  // Chart data for semester GPA & cumulative CGPA
  const chartPoints = cgpaResult.semesterResults.map((r, i) => ({
    label: `Sem ${i + 1}`,
    name: r.name,
    gpa: r.gpa,
    cumulative: r.cumulativeCGPA,
    tcu: r.tcu,
  }));

  // SVG Chart Geometry
  const chartHeight = 200;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 30;
  const innerWidth = chartWidth - (paddingX * 2);
  const innerHeight = chartHeight - (paddingY * 2);
  const maxScaleVal = scale.maxPoints;

  const getY = (val: number) => {
    const ratio = Math.max(0, Math.min(maxScaleVal, val)) / maxScaleVal;
    return chartHeight - paddingY - (ratio * innerHeight);
  };

  const getX = (index: number) => {
    if (chartPoints.length <= 1) return paddingX + innerWidth / 2;
    return paddingX + (index / (chartPoints.length - 1)) * innerWidth;
  };

  // Generate SVG path for cumulative CGPA
  const linePath = chartPoints.length > 0
    ? chartPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.cumulative)}`).join(' ')
    : '';

  // First class reference line
  const firstClassVal = scale.maxPoints === 4.0 ? 3.50 : (scale.maxPoints === 7.0 ? 6.00 : 4.50);
  const firstClassY = getY(firstClassVal);
  const targetY = getY(profile.targetCGPA);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Academic Trends & Performance Visualizer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Semester Progression & Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Track semester-by-semester GPA trends against your target benchmark, analyze grade distribution, and monitor your degree completion runway.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Degree Completion</span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                {unitsDone}
              </span>
              <span className="text-sm text-slate-500 font-mono">/ {unitsTarget} Credit Units</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mt-4 overflow-hidden">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Remaining: {Math.max(0, unitsTarget - unitsDone)} Units</span>
            <span>Est. ~{Math.ceil(Math.max(0, unitsTarget - unitsDone) / 18)} Semesters</span>
          </div>
        </div>

        {/* Current Standing Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Current Standing</span>
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {cgpaResult.degreeClass.name}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-mono tabular-nums font-extrabold text-emerald-600 dark:text-emerald-400">
                {cgpaResult.cgpa.toFixed(2)} CGPA
              </span>
              <span className="text-xs text-slate-400">({cgpaResult.degreeClass.badge})</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Target Benchmark: <strong className="text-slate-700 dark:text-slate-300">{profile.targetCGPA.toFixed(2)}</strong>
          </div>
        </div>

        {/* Motivational Streak Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Scholar Mindset</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-sm text-slate-200 font-medium leading-relaxed">
              &ldquo;In Nigerian universities, the First Class is constructed in the first 4 weeks of the semester through uncompromised Continuous Assessment (CA).&rdquo;
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Consistent daily study beats overnight panic</span>
          </div>
        </div>
      </div>

      {/* SVG Trend Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Historical Trendline</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              CGPA Trajectory vs Target Benchmark
            </h2>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-slate-600 dark:text-slate-300">Cumulative CGPA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500" />
              <span className="text-slate-600 dark:text-slate-300">Semester GPA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500" />
              <span className="text-slate-600 dark:text-slate-300">Target ({profile.targetCGPA.toFixed(2)})</span>
            </div>
          </div>
        </div>

        {/* SVG Container */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto max-h-[300px]">
            {/* Grid horizontal lines */}
            {[1, 2, 3, 4, 5].filter(val => val <= scale.maxPoints).map(val => (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={getY(val)}
                  x2={chartWidth - paddingX}
                  y2={getY(val)}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  className="text-slate-900 dark:text-white"
                />
                <text
                  x={paddingX - 8}
                  y={getY(val) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  fill="currentColor"
                  className="text-slate-400"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Target line */}
            <line
              x1={paddingX}
              y1={targetY}
              x2={chartWidth - paddingX}
              y2={targetY}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* First class reference line */}
            <line
              x1={paddingX}
              y1={firstClassY}
              x2={chartWidth - paddingX}
              y2={firstClassY}
              stroke="#059669"
              strokeDasharray="2 2"
              strokeOpacity="0.5"
              strokeWidth="1"
            />

            {/* Bar columns for individual semester GPA */}
            {chartPoints.map((p, idx) => {
              const x = getX(idx);
              const barWidth = 24;
              const barHeight = chartHeight - paddingY - getY(p.gpa);
              return (
                <g key={`bar-${idx}`}>
                  <rect
                    x={x - barWidth / 2}
                    y={getY(p.gpa)}
                    width={barWidth}
                    height={Math.max(2, barHeight)}
                    rx="3"
                    className="fill-blue-500/20 stroke-blue-500/50"
                    strokeWidth="1"
                  />
                  {/* Semester label under x-axis */}
                  <text
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    className="text-slate-500 font-medium"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}

            {/* Cumulative CGPA line */}
            {chartPoints.length > 1 && (
              <path
                d={linePath}
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points on cumulative line */}
            {chartPoints.map((p, idx) => {
              const x = getX(idx);
              const y = getY(p.cumulative);
              return (
                <g key={`dot-${idx}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#059669"
                  >
                    {p.cumulative.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Grade Distribution Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Overall Grade Distribution ({totalCourses} Courses Completed)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visual breakdown of all grades achieved across all registered semesters.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {scale.grades.map((g) => {
            const count = gradeCounts[g.letter] || 0;
            const percent = totalCourses > 0 ? Math.round((count / totalCourses) * 100) : 0;

            return (
              <div
                key={g.letter}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    Grade {g.letter}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    {g.points} pts
                  </span>
                </div>

                <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                  {count} <span className="text-xs font-normal text-slate-500">({percent}%)</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: g.points >= 4 ? '#059669' : g.points >= 3 ? '#0284c7' : g.points >= 2 ? '#d97706' : '#dc2626',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
