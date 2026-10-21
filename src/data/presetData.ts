import { AcademicDeadline, Semester, StudentProfile, StudyArticle } from '../types/academic';

export const DEPARTMENT_TEMPLATES: Record<string, { faculty: string; defaultSemesters: Semester[] }> = {
  'Computer Science': {
    faculty: 'Science / Computing',
    defaultSemesters: [
      {
        id: 'sem-100-1',
        level: 100,
        semesterNumber: 1,
        name: '100 Level — 1st Semester',
        courses: [
          { id: 'c1', code: 'CSC 101', title: 'Introduction to Computer Science', creditUnits: 3, grade: 'A' },
          { id: 'c2', code: 'MTH 101', title: 'Elementary Mathematics I (Algebra & Trig)', creditUnits: 4, grade: 'B' },
          { id: 'c3', code: 'PHY 101', title: 'General Physics I (Mechanics & Heat)', creditUnits: 3, grade: 'A' },
          { id: 'c4', code: 'CHM 101', title: 'General Chemistry I', creditUnits: 3, grade: 'B' },
          { id: 'c5', code: 'GST 101', title: 'Use of English & Communication Skills', creditUnits: 2, grade: 'A' },
          { id: 'c6', code: 'PHY 107', title: 'General Physics Practical I', creditUnits: 1, grade: 'A' },
          { id: 'c7', code: 'GST 103', title: 'Nigerian Peoples and Culture', creditUnits: 2, grade: 'B' },
        ],
      },
      {
        id: 'sem-100-2',
        level: 100,
        semesterNumber: 2,
        name: '100 Level — 2nd Semester',
        courses: [
          { id: 'c8', code: 'CSC 102', title: 'Computer Programming I (Python/C)', creditUnits: 3, grade: 'A' },
          { id: 'c9', code: 'MTH 102', title: 'Elementary Mathematics II (Calculus)', creditUnits: 4, grade: 'A' },
          { id: 'c10', code: 'PHY 102', title: 'General Physics II (Electricity & Mag)', creditUnits: 3, grade: 'B' },
          { id: 'c11', code: 'GST 102', title: 'Philosophy, Logic and Human Existence', creditUnits: 2, grade: 'A' },
          { id: 'c12', code: 'STA 102', title: 'Probability and Statistics I', creditUnits: 3, grade: 'B' },
          { id: 'c13', code: 'PHY 108', title: 'General Physics Practical II', creditUnits: 1, grade: 'A' },
        ],
      },
      {
        id: 'sem-200-1',
        level: 200,
        semesterNumber: 1,
        name: '200 Level — 1st Semester',
        courses: [
          { id: 'c14', code: 'CSC 201', title: 'Computer Programming II (OOP Java)', creditUnits: 3, grade: 'A' },
          { id: 'c15', code: 'CSC 205', title: 'Discrete Mathematics & Structures', creditUnits: 3, grade: 'A' },
          { id: 'c16', code: 'CSC 203', title: 'Digital Electronics & Computer Arch', creditUnits: 3, grade: 'B' },
          { id: 'c17', code: 'MTH 201', title: 'Mathematical Methods I (Linear Alg)', creditUnits: 3, grade: 'B' },
          { id: 'c18', code: 'GST 201', title: 'Peace Studies and Conflict Resolution', creditUnits: 2, grade: 'A' },
          { id: 'c19', code: 'STA 205', title: 'Statistics for Physical Sciences', creditUnits: 3, grade: 'A' },
        ],
      },
      {
        id: 'sem-200-2',
        level: 200,
        semesterNumber: 2,
        name: '200 Level — 2nd Semester',
        courses: [
          { id: 'c20', code: 'CSC 202', title: 'Data Structures and Algorithms', creditUnits: 3, grade: 'A' },
          { id: 'c21', code: 'CSC 204', title: 'Fundamentals of Data Processing', creditUnits: 3, grade: 'B' },
          { id: 'c22', code: 'CSC 208', title: 'Assembly Language Programming', creditUnits: 3, grade: 'C' },
          { id: 'c23', code: 'GST 202', title: 'Entrepreneurship & Innovation', creditUnits: 2, grade: 'A' },
          { id: 'c24', code: 'CSC 299', title: 'Industrial Training / SIWES Prep', creditUnits: 2, grade: 'A' },
        ],
      },
    ],
  },
  'Engineering (Electrical/Mech)': {
    faculty: 'Engineering & Technology',
    defaultSemesters: [
      {
        id: 'eng-100-1',
        level: 100,
        semesterNumber: 1,
        name: '100 Level — 1st Semester',
        courses: [
          { id: 'e1', code: 'MTH 101', title: 'General Mathematics I', creditUnits: 4, grade: 'A' },
          { id: 'e2', code: 'PHY 101', title: 'General Physics I', creditUnits: 3, grade: 'B' },
          { id: 'e3', code: 'CHM 101', title: 'General Chemistry I', creditUnits: 3, grade: 'B' },
          { id: 'e4', code: 'ENG 101', title: 'Introduction to Engineering', creditUnits: 2, grade: 'A' },
          { id: 'e5', code: 'ENG 103', title: 'Engineering Drawing I', creditUnits: 2, grade: 'A' },
          { id: 'e6', code: 'GST 101', title: 'Use of English', creditUnits: 2, grade: 'A' },
        ],
      },
      {
        id: 'eng-100-2',
        level: 100,
        semesterNumber: 2,
        name: '100 Level — 2nd Semester',
        courses: [
          { id: 'e7', code: 'MTH 102', title: 'General Mathematics II', creditUnits: 4, grade: 'A' },
          { id: 'e8', code: 'PHY 102', title: 'General Physics II', creditUnits: 3, grade: 'A' },
          { id: 'e9', code: 'ENG 102', title: 'Engineering Workshop Practice', creditUnits: 2, grade: 'A' },
          { id: 'e10', code: 'ENG 104', title: 'Engineering Drawing II (CAD)', creditUnits: 2, grade: 'B' },
          { id: 'e11', code: 'CSC 102', title: 'Introduction to Computing', creditUnits: 3, grade: 'A' },
        ],
      },
    ],
  },
  'Law (LL.B)': {
    faculty: 'Law',
    defaultSemesters: [
      {
        id: 'law-100-1',
        level: 100,
        semesterNumber: 1,
        name: '100 Level — 1st Semester',
        courses: [
          { id: 'l1', code: 'PUL 101', title: 'Legal Method I', creditUnits: 4, grade: 'A' },
          { id: 'l2', code: 'JIL 101', title: 'Nigerian Legal System I', creditUnits: 4, grade: 'B' },
          { id: 'l3', code: 'GST 101', title: 'Use of English', creditUnits: 2, grade: 'A' },
          { id: 'l4', code: 'POS 101', title: 'Introduction to Political Science', creditUnits: 3, grade: 'B' },
          { id: 'l5', code: 'SOC 101', title: 'Introduction to Sociology', creditUnits: 3, grade: 'A' },
        ],
      },
      {
        id: 'law-100-2',
        level: 100,
        semesterNumber: 2,
        name: '100 Level — 2nd Semester',
        courses: [
          { id: 'l6', code: 'PUL 102', title: 'Legal Method II', creditUnits: 4, grade: 'A' },
          { id: 'l7', code: 'JIL 102', title: 'Nigerian Legal System II', creditUnits: 4, grade: 'A' },
          { id: 'l8', code: 'GST 102', title: 'Philosophy and Logic', creditUnits: 2, grade: 'A' },
          { id: 'l9', code: 'HIS 102', title: 'Nigerian History Since 1800', creditUnits: 3, grade: 'B' },
        ],
      },
    ],
  },
  'Accounting & Finance': {
    faculty: 'Management Sciences',
    defaultSemesters: [
      {
        id: 'acc-100-1',
        level: 100,
        semesterNumber: 1,
        name: '100 Level — 1st Semester',
        courses: [
          { id: 'a1', code: 'ACC 101', title: 'Introduction to Financial Accounting I', creditUnits: 3, grade: 'A' },
          { id: 'a2', code: 'ECO 101', title: 'Principles of Economics I (Micro)', creditUnits: 3, grade: 'A' },
          { id: 'a3', code: 'BUS 101', title: 'Introduction to Business I', creditUnits: 3, grade: 'B' },
          { id: 'a4', code: 'MTH 105', title: 'Mathematics for Management Sciences', creditUnits: 3, grade: 'B' },
          { id: 'a5', code: 'GST 101', title: 'Use of English', creditUnits: 2, grade: 'A' },
        ],
      },
      {
        id: 'acc-100-2',
        level: 100,
        semesterNumber: 2,
        name: '100 Level — 2nd Semester',
        courses: [
          { id: 'a6', code: 'ACC 102', title: 'Introduction to Financial Accounting II', creditUnits: 3, grade: 'A' },
          { id: 'a7', code: 'ECO 102', title: 'Principles of Economics II (Macro)', creditUnits: 3, grade: 'B' },
          { id: 'a8', code: 'BUS 102', title: 'Introduction to Business II', creditUnits: 3, grade: 'A' },
          { id: 'a9', code: 'GST 102', title: 'Nigerian Peoples and Culture', creditUnits: 2, grade: 'A' },
        ],
      },
    ],
  },
};

export const DEFAULT_INITIAL_PROFILE: StudentProfile = {
  studentName: 'Chidubem Okafor',
  institutionName: 'University of Lagos (UNILAG)',
  department: 'Computer Science',
  faculty: 'Science',
  scaleType: 'nuc_5_0',
  currentLevel: 200,
  targetCGPA: 4.50, // Aiming for First Class
  totalDegreeUnits: 140, // Standard 4-year degree total units
  semesters: DEPARTMENT_TEMPLATES['Computer Science'].defaultSemesters,
};

export const INITIAL_DEADLINES: AcademicDeadline[] = [
  {
    id: 'dl-1',
    courseCode: 'CSC 202',
    title: 'Mid-Semester Continuous Assessment (CA) Test',
    type: 'ca_test',
    date: '2026-10-28',
    time: '10:00',
    venue: 'Computing Lab 3 / New Faculty Hall',
    notes: 'Covers Trees, Graphs, Sorting algorithms. 30 marks total.',
    completed: false,
  },
  {
    id: 'dl-2',
    courseCode: 'CSC 204',
    title: 'Term Paper & SQL Project Submission',
    type: 'assignment',
    date: '2026-11-04',
    time: '23:59',
    venue: 'Department LMS Portal',
    notes: 'Upload report in PDF format alongside normalized schema.',
    completed: false,
  },
  {
    id: 'dl-3',
    courseCode: 'CSC 208',
    title: 'Assembly Language Lab Practical Exam',
    type: 'exam',
    date: '2026-11-16',
    time: '14:00',
    venue: 'Hardware Lab A',
    notes: 'Bring student ID card and lab manual. x86 microprocessor registers.',
    completed: false,
  },
  {
    id: 'dl-4',
    courseCode: 'GST 202',
    title: 'Entrepreneurship Pitch Presentation',
    type: 'project_defense',
    date: '2026-11-22',
    time: '09:00',
    venue: 'Multipurpose Hall A',
    notes: 'Group 4 business plan presentation in formal attire.',
    completed: false,
  },
];

export const STUDY_LIBRARY_ARTICLES: StudyArticle[] = [
  {
    id: 'art-ca-mastery',
    title: 'Mastering Continuous Assessment (CA): Why 30–40 Marks Win the First Class',
    category: 'ca_mastery',
    readTime: '4 min read',
    summary: 'In Nigerian universities, the semester exam is only 60 or 70 marks. Winning 26+ marks in Continuous Assessment secures an A before you even walk into the exam hall.',
    keyTakeaways: [
      'CA marks are usually 30 marks (or 40 in some polytechnics/faculties).',
      'If you score 27/30 in CA, you only need 43/70 in the final exam to secure an A grade (70%).',
      'Never miss unannounced tests or practical sign-offs: zero in CA almost guarantees a C, D, or carryover.',
    ],
    content: [
      'The single biggest mistake freshmen and sophomore students make in Nigerian tertiary institutions is ignoring Continuous Assessment (CA). Many students focus 90% of their emotional energy on "reading for exams" during exam week, failing to realize the battle is 40% won in week 4 through week 9.',
      'In the Nigerian University Commission (NUC) framework, grading is out of 100 marks. Usually, 30 marks are allocated to tests, assignments, group presentations, and laboratory attendance. The final written examination constitutes the remaining 70 marks (or a 40/60 split in select universities).',
      'Mathematical breakdown: If student A scores 28 out of 30 in CA, they only need 42 out of 70 (60%) in the main exam to attain an overall score of 70%, which is a solid "A" (5.0 GP). In contrast, student B who neglected CA and scored 14 out of 30 now requires an astounding 56 out of 70 (80%) on the final paper just to touch 70%. In rigorous engineering or medical science courses, scoring 80% on a departmental exam is notoriously rare.',
      'Actionable Rule: Treat every single assignment, attendance sheet, and surprise test as your primary defense. If a lecturer gives a 5-mark assignment, write it with the rigor of a journal publication.',
    ],
  },
  {
    id: 'art-quality-points',
    title: 'The Mathematics of Quality Points: Why 3-Unit Courses Sways Your Future',
    category: 'cgpa_strategy',
    readTime: '5 min read',
    summary: 'Understanding Total Credit Points (TCP) vs Total Credit Units (TCU). Learn why getting an A in a 4-unit course cancels out a C in two 1-unit courses.',
    keyTakeaways: [
      'Quality Points (TCP) = Credit Units × Grade Points.',
      'A 4-unit course with an A delivers 20 Quality Points; a 1-unit course with an A delivers only 5 points.',
      'Simple averaging of two semester GPAs is mathematically wrong whenever credit unit totals differ.',
    ],
    content: [
      'Why can you not simply add Semester 1 GPA (4.20) and Semester 2 GPA (3.60) and divide by 2? Because Nigerian universities weight your performance strictly by Credit Units (Quality Points).',
      'Suppose Semester 1 had 24 credit units with a GPA of 4.20 (TCP = 100.8). Suppose Semester 2 was an internship or lighter term with only 12 credit units and a GPA of 3.60 (TCP = 43.2).',
      'A simple naive average gives: (4.20 + 3.60) / 2 = 3.90.',
      'The genuine NUC CGPA is: Total TCP / Total TCU = (100.8 + 43.2) / (24 + 12) = 144 / 36 = 4.00! The naive student cheated themselves out of 0.10 CGPA because the heavier semester pulls harder on the scale.',
      'High Leverage Strategy: Always map out the credit load at the beginning of the semester. Allocate your prime study hours in direct proportion to course units: 4-unit core courses get top priority, 3-unit courses get substantial focus, and 1-unit electives should be handled efficiently without consuming excessive bandwidth.',
    ],
  },
  {
    id: 'art-carryover-recovery',
    title: 'Carryover Recovery Blueprint: Rebuilding Momentum After an F Grade',
    category: 'tackling_carryovers',
    readTime: '6 min read',
    summary: 'A step-by-step roadmap for clearing carryovers in Nigerian universities without overloading yourself or dropping your current semester CGPA.',
    keyTakeaways: [
      'In NUC universities, an F grade is 0 points but the credit units remain permanently in your cumulative TCU.',
      'When you retake and score an A (5 points), you inject fresh points that rescue your cumulative average.',
      'Do not register beyond the university maximum credit limit (usually 24 units); overload leads to cascading failure.',
    ],
    content: [
      'Getting a carryover (an F grade, 0 points) in a Nigerian tertiary institution can feel devastating. But mathematically, a carryover is a temporary setback that can be conquered with a systematic formula.',
      'Understand the mechanism: When you receive an F in a 3-unit course, it contributes 0 TCP while 3 TCU is added to your denominator. Your CGPA dips because you divided by a larger number with zero numerator boost.',
      'When you retake that course next session and obtain an A, you add (3 units × 5 points = 15 TCP) and 3 TCU. Over the two attempts, you will have completed 6 TCU with 15 TCP, resulting in an effective 2.50 average on that course rather than a permanent zero.',
      'Critical Warning on Maximum Units: Nigerian university portals typically impose a ceiling between 24 and 28 credit units per semester. If you have 20 units of current level courses, adding two 3-unit carryover courses will hit 26 units. Never bite off more than you can chew. If necessary, consult your Level Adviser to defer non-prerequisite electives to the final year.',
    ],
  },
  {
    id: 'art-tdb-vs-spaced',
    title: 'Till Daybreak (TDB) vs Spaced Repetition: What Cognitive Science Proves',
    category: 'exam_technique',
    readTime: '5 min read',
    summary: 'Examining the culture of "TDB" night vigils on Nigerian campuses and replacing sleep deprivation with high-yield memory retention protocols.',
    keyTakeaways: [
      'TDB (all-night cramming) reduces working memory by up to 38% during morning exams.',
      '2 hours of daily review across 4 weeks outperforms 14 hours of consecutive overnight reading before an exam.',
      'Use past questions (PQs) as active recall tests, not just passive reading material.',
    ],
    content: [
      'Walking through Nigerian university lecture theatres between 11:00 PM and 5:00 AM during exam season reveals hundreds of students bundled in jackets, drinking energy drinks and instant coffee, attempting "TDB" (Till Daybreak).',
      'While group solidarity feels motivating, cognitive neuroscience demonstrates that sleep deprivation severely impairs the prefrontal cortex—the exact brain region required for complex derivation in Calculus, Circuit Analysis, and Case Law reasoning.',
      'When you sleep, your hippocampus replays and transfers short-term lecture notes into neocortical long-term memory. Pulling an all-nighter right before an exam blocks this memory consolidation.',
      'The First Class Replacement Strategy: Replace marathon cramming with the 30-day Spaced Repetition rhythm. Solve 5 years of departmental Past Questions (PQs) under timed exam conditions without checking answers. When you encounter a roadblock, study that specific textbook section immediately. Sleep at least 6 hours before any 8:00 AM exam to keep your analytical speed peak-sharp.',
    ],
  },
];
