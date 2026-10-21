import { DegreeClass, GradeDefinition, GradingScaleType } from '../types/academic';

export interface GradingScaleConfig {
  id: GradingScaleType;
  name: string;
  maxPoints: number;
  description: string;
  grades: GradeDefinition[];
  degreeClasses: DegreeClass[];
}

export const GRADING_SCALES: Record<GradingScaleType, GradingScaleConfig> = {
  nuc_5_0: {
    id: 'nuc_5_0',
    name: 'NUC Standard 5.0 Scale (Current Benchmark)',
    maxPoints: 5.0,
    description: 'Adopted by federal, state, and private universities in Nigeria (A=5, B=4, C=3, D=2, F=0; E grade discontinued by NUC).',
    grades: [
      { letter: 'A', points: 5, minScore: 70, maxScore: 100, description: 'Excellent' },
      { letter: 'B', points: 4, minScore: 60, maxScore: 69, description: 'Very Good' },
      { letter: 'C', points: 3, minScore: 50, maxScore: 59, description: 'Good' },
      { letter: 'D', points: 2, minScore: 45, maxScore: 49, description: 'Fair / Pass' },
      { letter: 'F', points: 0, minScore: 0, maxScore: 44, description: 'Fail' },
    ],
    degreeClasses: [
      { name: 'First Class Honours', minCGPA: 4.50, maxCGPA: 5.00, color: '#059669', badge: '1st Class' },
      { name: 'Second Class (Upper Division)', minCGPA: 3.50, maxCGPA: 4.49, color: '#0284c7', badge: '2:1 (Upper)' },
      { name: 'Second Class (Lower Division)', minCGPA: 2.40, maxCGPA: 3.49, color: '#d97706', badge: '2:2 (Lower)' },
      { name: 'Third Class Honours', minCGPA: 1.50, maxCGPA: 2.39, color: '#ea580c', badge: '3rd Class' },
      { name: 'Pass Degree', minCGPA: 1.00, maxCGPA: 1.49, color: '#64748b', badge: 'Pass' },
      { name: 'Fail / Academic Probation', minCGPA: 0.00, maxCGPA: 0.99, color: '#dc2626', badge: 'Probation' },
    ],
  },
  nuc_5_0_with_e: {
    id: 'nuc_5_0_with_e',
    name: '5.0 Scale with E Grade (Traditional)',
    maxPoints: 5.0,
    description: 'Traditional 5-point scale with E (40-44% = 1 point) used in some university faculties.',
    grades: [
      { letter: 'A', points: 5, minScore: 70, maxScore: 100, description: 'Excellent' },
      { letter: 'B', points: 4, minScore: 60, maxScore: 69, description: 'Very Good' },
      { letter: 'C', points: 3, minScore: 50, maxScore: 59, description: 'Good' },
      { letter: 'D', points: 2, minScore: 45, maxScore: 49, description: 'Fair' },
      { letter: 'E', points: 1, minScore: 40, maxScore: 44, description: 'Pass' },
      { letter: 'F', points: 0, minScore: 0, maxScore: 39, description: 'Fail' },
    ],
    degreeClasses: [
      { name: 'First Class Honours', minCGPA: 4.50, maxCGPA: 5.00, color: '#059669', badge: '1st Class' },
      { name: 'Second Class (Upper Division)', minCGPA: 3.50, maxCGPA: 4.49, color: '#0284c7', badge: '2:1 (Upper)' },
      { name: 'Second Class (Lower Division)', minCGPA: 2.40, maxCGPA: 3.49, color: '#d97706', badge: '2:2 (Lower)' },
      { name: 'Third Class Honours', minCGPA: 1.50, maxCGPA: 2.39, color: '#ea580c', badge: '3rd Class' },
      { name: 'Pass Degree', minCGPA: 1.00, maxCGPA: 1.49, color: '#64748b', badge: 'Pass' },
      { name: 'Fail / Academic Probation', minCGPA: 0.00, maxCGPA: 0.99, color: '#dc2626', badge: 'Probation' },
    ],
  },
  poly_4_0: {
    id: 'poly_4_0',
    name: 'NBTE 4.0 Scale (Polytechnics / ND / HND)',
    maxPoints: 4.0,
    description: 'National Board for Technical Education (NBTE) standard for Polytechnics and Monotechnics across Nigeria.',
    grades: [
      { letter: 'A', points: 4.0, minScore: 75, maxScore: 100, description: 'Distinction' },
      { letter: 'AB', points: 3.5, minScore: 70, maxScore: 74, description: 'Upper Credit' },
      { letter: 'B', points: 3.25, minScore: 65, maxScore: 69, description: 'Upper Credit' },
      { letter: 'BC', points: 3.0, minScore: 60, maxScore: 64, description: 'Upper Credit' },
      { letter: 'C', points: 2.75, minScore: 55, maxScore: 59, description: 'Lower Credit' },
      { letter: 'CD', points: 2.5, minScore: 50, maxScore: 54, description: 'Lower Credit' },
      { letter: 'D', points: 2.25, minScore: 45, maxScore: 49, description: 'Pass' },
      { letter: 'E', points: 2.0, minScore: 40, maxScore: 44, description: 'Pass' },
      { letter: 'F', points: 0.0, minScore: 0, maxScore: 39, description: 'Fail' },
    ],
    degreeClasses: [
      { name: 'Distinction', minCGPA: 3.50, maxCGPA: 4.00, color: '#059669', badge: 'Distinction' },
      { name: 'Upper Credit', minCGPA: 3.00, maxCGPA: 3.49, color: '#0284c7', badge: 'Upper Credit' },
      { name: 'Lower Credit', minCGPA: 2.50, maxCGPA: 2.99, color: '#d97706', badge: 'Lower Credit' },
      { name: 'Pass', minCGPA: 2.00, maxCGPA: 2.49, color: '#64748b', badge: 'Pass' },
      { name: 'Fail', minCGPA: 0.00, maxCGPA: 1.99, color: '#dc2626', badge: 'Fail' },
    ],
  },
  ui_7_0: {
    id: 'ui_7_0',
    name: 'University of Ibadan 7.0 Scale (Legacy / Special)',
    maxPoints: 7.0,
    description: 'Renowned 7-point scale historically used at UI (Premier University) and select specialized colleges.',
    grades: [
      { letter: '7', points: 7, minScore: 70, maxScore: 100, description: 'Excellent (7.0)' },
      { letter: '6', points: 6, minScore: 65, maxScore: 69, description: 'Very Good (6.0)' },
      { letter: '5', points: 5, minScore: 60, maxScore: 64, description: 'Good (5.0)' },
      { letter: '4', points: 4, minScore: 55, maxScore: 59, description: 'Satisfactory (4.0)' },
      { letter: '3', points: 3, minScore: 50, maxScore: 54, description: 'Fair (3.0)' },
      { letter: '2', points: 2, minScore: 45, maxScore: 49, description: 'Pass (2.0)' },
      { letter: '1', points: 1, minScore: 40, maxScore: 44, description: 'Weak Pass (1.0)' },
      { letter: '0', points: 0, minScore: 0, maxScore: 39, description: 'Fail (0.0)' },
    ],
    degreeClasses: [
      { name: 'First Class Honours', minCGPA: 6.00, maxCGPA: 7.00, color: '#059669', badge: '1st Class' },
      { name: 'Second Class (Upper Division)', minCGPA: 4.60, maxCGPA: 5.99, color: '#0284c7', badge: '2:1 (Upper)' },
      { name: 'Second Class (Lower Division)', minCGPA: 2.60, maxCGPA: 4.59, color: '#d97706', badge: '2:2 (Lower)' },
      { name: 'Third Class Honours', minCGPA: 1.60, maxCGPA: 2.59, color: '#ea580c', badge: '3rd Class' },
      { name: 'Pass Degree', minCGPA: 1.00, maxCGPA: 1.59, color: '#64748b', badge: 'Pass' },
      { name: 'Fail / Probation', minCGPA: 0.00, maxCGPA: 0.99, color: '#dc2626', badge: 'Fail' },
    ],
  },
};

export function getGradePoint(letter: string, scaleType: GradingScaleType): number {
  const scale = GRADING_SCALES[scaleType] || GRADING_SCALES.nuc_5_0;
  const match = scale.grades.find(g => g.letter.toUpperCase() === letter.toUpperCase());
  return match ? match.points : 0;
}

export function scoreToGrade(score: number, scaleType: GradingScaleType): string {
  const scale = GRADING_SCALES[scaleType] || GRADING_SCALES.nuc_5_0;
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const g of scale.grades) {
    if (clamped >= g.minScore && clamped <= g.maxScore) {
      return g.letter;
    }
  }
  return scale.grades[scale.grades.length - 1].letter;
}

export function getDegreeClass(cgpa: number, scaleType: GradingScaleType): DegreeClass {
  const scale = GRADING_SCALES[scaleType] || GRADING_SCALES.nuc_5_0;
  for (const dc of scale.degreeClasses) {
    if (cgpa >= dc.minCGPA && cgpa <= dc.maxCGPA) {
      return dc;
    }
  }
  return scale.degreeClasses[scale.degreeClasses.length - 1];
}
