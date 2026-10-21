export type GradingScaleType = 'nuc_5_0' | 'poly_4_0' | 'ui_7_0' | 'nuc_5_0_with_e';

export interface GradeDefinition {
  letter: string;
  points: number;
  minScore: number;
  maxScore: number;
  description: string;
}

export interface DegreeClass {
  name: string;
  minCGPA: number;
  maxCGPA: number;
  color: string;
  badge: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  grade: string;
  score?: number;
  isCarryover?: boolean;
}

export interface Semester {
  id: string;
  level: number; // 100, 200, 300, 400, 500, 600
  semesterNumber: 1 | 2;
  name: string;
  courses: Course[];
  notes?: string;
}

export interface StudentProfile {
  studentName: string;
  institutionName: string;
  department: string;
  faculty: string;
  scaleType: GradingScaleType;
  currentLevel: number;
  targetCGPA: number;
  totalDegreeUnits: number;
  semesters: Semester[];
  lastSynced?: string;
}

export type DeadlineType = 'exam' | 'ca_test' | 'assignment' | 'project_defense' | 'course_reg';

export interface AcademicDeadline {
  id: string;
  courseCode: string;
  title: string;
  type: DeadlineType;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  venue?: string;
  notes?: string;
  completed: boolean;
}

export interface StudyArticle {
  id: string;
  title: string;
  category: 'cgpa_strategy' | 'ca_mastery' | 'exam_technique' | 'tackling_carryovers';
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  content: string[];
}
