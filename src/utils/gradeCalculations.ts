import { Course, GradingScaleType, Semester } from '../types/academic';
import { getDegreeClass, getGradePoint, GRADING_SCALES } from '../data/gradingScales';

export interface SemesterCalculationResult {
  tcu: number; // Total Credit Units
  tcp: number; // Total Credit Points / Quality Points
  gpa: number;
  coursesCount: number;
  gradeDistribution: Record<string, number>;
}

export interface CGPACalculationResult {
  totalTCU: number;
  totalTCP: number;
  cgpa: number;
  semestersCount: number;
  degreeClass: ReturnType<typeof getDegreeClass>;
  isProbationRisk: boolean;
  isFirstClassPace: boolean;
  semesterResults: {
    semesterId: string;
    level: number;
    semesterNumber: number;
    name: string;
    tcu: number;
    tcp: number;
    gpa: number;
    cumulativeCGPA: number;
  }[];
}

export interface TargetAnalysisResult {
  currentCGPA: number;
  currentTCU: number;
  currentTCP: number;
  targetCGPA: number;
  remainingUnits: number;
  totalDegreeUnits: number;
  requiredRemainingGPA: number;
  isAchievable: boolean;
  difficulty: 'comfortable' | 'challenging' | 'demanding' | 'mathematically_impossible';
  maxPossibleCGPA: number;
  strategicAdvice: string[];
}

export interface CourseLeverage {
  courseId: string;
  code: string;
  title: string;
  creditUnits: number;
  currentGrade: string;
  currentPoints: number;
  currentTCP: number;
  unitWeightPercent: number;
  impactIfA: number; // How much semester GPA increases if this course becomes an 'A'
}

/**
 * Calculates GPA for a single semester:
 * GPA = Total Credit Points (TCP) / Total Credit Units (TCU)
 * where TCP = Sum of (Credit Units * Grade Point)
 */
export function calculateSemesterGPA(courses: Course[], scaleType: GradingScaleType): SemesterCalculationResult {
  const gradeDistribution: Record<string, number> = {};
  let tcu = 0;
  let tcp = 0;

  for (const course of courses) {
    if (!course.grade || course.creditUnits <= 0) continue;
    const gradeLetter = course.grade.toUpperCase();
    const points = getGradePoint(gradeLetter, scaleType);
    const courseTCP = course.creditUnits * points;

    tcu += course.creditUnits;
    tcp += courseTCP;

    gradeDistribution[gradeLetter] = (gradeDistribution[gradeLetter] || 0) + 1;
  }

  const gpa = tcu > 0 ? Number((tcp / tcu).toFixed(2)) : 0.0;

  return {
    tcu,
    tcp,
    gpa,
    coursesCount: courses.filter(c => c.grade && c.creditUnits > 0).length,
    gradeDistribution,
  };
}

/**
 * Calculates Cumulative Grade Point Average (CGPA) across multiple semesters:
 * CGPA = Sum(All Semester TCPs) / Sum(All Semester TCUs)
 */
export function calculateCGPA(semesters: Semester[], scaleType: GradingScaleType): CGPACalculationResult {
  let cumulativeTCP = 0;
  let cumulativeTCU = 0;
  const semesterResults: CGPACalculationResult['semesterResults'] = [];

  for (const sem of semesters) {
    const semCalc = calculateSemesterGPA(sem.courses, scaleType);
    cumulativeTCP += semCalc.tcp;
    cumulativeTCU += semCalc.tcu;

    const cumulativeCGPA = cumulativeTCU > 0 ? Number((cumulativeTCP / cumulativeTCU).toFixed(2)) : 0.0;

    semesterResults.push({
      semesterId: sem.id,
      level: sem.level,
      semesterNumber: sem.semesterNumber,
      name: sem.name,
      tcu: semCalc.tcu,
      tcp: semCalc.tcp,
      gpa: semCalc.gpa,
      cumulativeCGPA,
    });
  }

  const cgpa = cumulativeTCU > 0 ? Number((cumulativeTCP / cumulativeTCU).toFixed(2)) : 0.0;
  const degreeClass = getDegreeClass(cgpa, scaleType);
  const scale = GRADING_SCALES[scaleType] || GRADING_SCALES.nuc_5_0;

  const probationThreshold = scale.maxPoints === 4.0 ? 2.00 : 1.50;
  const isProbationRisk = cgpa < probationThreshold && cumulativeTCU > 0;
  const firstClassThreshold = scale.maxPoints === 4.0 ? 3.50 : (scale.maxPoints === 7.0 ? 6.00 : 4.50);
  const isFirstClassPace = cgpa >= firstClassThreshold && cumulativeTCU > 0;

  return {
    totalTCU: cumulativeTCU,
    totalTCP: cumulativeTCP,
    cgpa,
    semestersCount: semesters.filter(s => s.courses.some(c => c.grade)).length,
    degreeClass,
    isProbationRisk,
    isFirstClassPace,
    semesterResults,
  };
}

/**
 * Target CGPA Simulator & Room for Improvement Engine:
 * Evaluates how many remaining units are needed and what GPA must be maintained
 * to hit the student's target degree classification.
 */
export function analyzeTargetGoal(
  currentCGPA: number,
  currentTCU: number,
  targetCGPA: number,
  totalDegreeUnits: number,
  scaleType: GradingScaleType
): TargetAnalysisResult {
  const scale = GRADING_SCALES[scaleType] || GRADING_SCALES.nuc_5_0;
  const currentTCP = currentCGPA * currentTCU;
  const remainingUnits = Math.max(0, totalDegreeUnits - currentTCU);

  // Maximum possible CGPA if student scores straight 'A's (max points) in all remaining units
  const maxPossibleTCP = currentTCP + (remainingUnits * scale.maxPoints);
  const maxPossibleCGPA = totalDegreeUnits > 0 ? Number((maxPossibleTCP / totalDegreeUnits).toFixed(2)) : scale.maxPoints;

  // Formula to hit target:
  // Target = (CurrentTCP + RequiredRemainingTCP) / TotalDegreeUnits
  // RequiredRemainingTCP = (Target * TotalDegreeUnits) - CurrentTCP
  // RequiredRemainingGPA = RequiredRemainingTCP / RemainingUnits
  let requiredRemainingGPA = 0;
  let isAchievable = true;
  let difficulty: TargetAnalysisResult['difficulty'] = 'comfortable';

  if (remainingUnits <= 0) {
    requiredRemainingGPA = targetCGPA;
    isAchievable = currentCGPA >= targetCGPA;
    difficulty = isAchievable ? 'comfortable' : 'mathematically_impossible';
  } else {
    const requiredTCP = (targetCGPA * totalDegreeUnits) - currentTCP;
    requiredRemainingGPA = Number((requiredTCP / remainingUnits).toFixed(2));

    if (requiredRemainingGPA > scale.maxPoints) {
      isAchievable = false;
      difficulty = 'mathematically_impossible';
    } else if (requiredRemainingGPA >= scale.maxPoints - 0.25) {
      difficulty = 'demanding';
    } else if (requiredRemainingGPA >= scale.maxPoints - 0.8) {
      difficulty = 'challenging';
    } else {
      difficulty = 'comfortable';
    }
  }

  // Generate actionable, tailored Nigerian academic advice
  const strategicAdvice: string[] = [];

  if (difficulty === 'mathematically_impossible') {
    strategicAdvice.push(
      `Hitting ${targetCGPA.toFixed(2)} is mathematically out of reach because even straight ${scale.grades[0].letter}s in all remaining ${remainingUnits} credit units yields a maximum CGPA of ${maxPossibleCGPA.toFixed(2)}.`
    );
    // Find the next best attainable degree class
    for (const dc of scale.degreeClasses) {
      if (maxPossibleCGPA >= dc.minCGPA) {
        strategicAdvice.push(
          `Recommended Pivot: Target graduating with ${dc.name} (${dc.badge}), which requires a CGPA of ${dc.minCGPA.toFixed(2)}. This is realistic and highly achievable!`
        );
        break;
      }
    }
  } else if (difficulty === 'demanding') {
    strategicAdvice.push(
      `High Stakes Target: You need an average GPA of ${requiredRemainingGPA.toFixed(2)} across your remaining ${remainingUnits} credit units (almost entirely ${scale.grades[0].letter}'s).`
    );
    strategicAdvice.push(
      `Zero Tolerated F's/Carryovers: Prioritize Continuous Assessment (CA) tests. In Nigerian universities, CA accounts for 30–40 marks; scoring 28+/30 on CA provides a safe buffer before finals.`
    );
    strategicAdvice.push(
      `High-Unit Leverage: Maximize study time on 3-unit and 4-unit departmental core courses rather than 1-unit electives.`
    );
  } else if (difficulty === 'challenging') {
    strategicAdvice.push(
      `Target within Reach: You need to maintain a ${requiredRemainingGPA.toFixed(2)} GPA across remaining semesters. A mix of ${scale.grades[0].letter}'s and ${scale.grades[1].letter}'s will secure this goal.`
    );
    strategicAdvice.push(
      `Target High Quality Points: Focus on courses where you can convert 'B' grades into 'A' grades with 5 to 10 additional marks in CA assignments and group projects.`
    );
  } else {
    strategicAdvice.push(
      `Comfortable Pace: You need a GPA of ${Math.max(0, requiredRemainingGPA).toFixed(2)} across remaining courses. Maintaining your current study discipline will comfortably deliver your target.`
    );
    strategicAdvice.push(
      `Consistency Guard: Protect your margin of error. Avoid unforced errors in departmental prerequisites and elective attendance requirements.`
    );
  }

  return {
    currentCGPA,
    currentTCU,
    currentTCP,
    targetCGPA,
    remainingUnits,
    totalDegreeUnits,
    requiredRemainingGPA: Math.max(0, requiredRemainingGPA),
    isAchievable,
    difficulty,
    maxPossibleCGPA,
    strategicAdvice,
  };
}

/**
 * Course Leverage Sensitivity Analysis:
 * Pinpoints which courses in a semester have the highest impact on GPA
 */
export function analyzeCourseLeverage(courses: Course[], scaleType: GradingScaleType): CourseLeverage[] {
  const currentCalc = calculateSemesterGPA(courses, scaleType);
  const scale = GRADING_SCALES[scaleType] || GRADING_SCALES.nuc_5_0;
  const maxLetter = scale.grades[0].letter;
  const maxPoints = scale.maxPoints;

  return courses.map(course => {
    const points = getGradePoint(course.grade || 'F', scaleType);
    const courseTCP = course.creditUnits * points;
    const unitWeightPercent = currentCalc.tcu > 0 ? Number(((course.creditUnits / currentCalc.tcu) * 100).toFixed(1)) : 0;

    // What if this specific course was upgraded to an 'A' (max points)?
    const hypotheticalTCP = currentCalc.tcp - courseTCP + (course.creditUnits * maxPoints);
    const hypotheticalGPA = currentCalc.tcu > 0 ? Number((hypotheticalTCP / currentCalc.tcu).toFixed(2)) : 0;
    const impactIfA = Number((hypotheticalGPA - currentCalc.gpa).toFixed(2));

    return {
      courseId: course.id,
      code: course.code,
      title: course.title,
      creditUnits: course.creditUnits,
      currentGrade: course.grade,
      currentPoints: points,
      currentTCP: courseTCP,
      unitWeightPercent,
      impactIfA: Math.max(0, impactIfA),
    };
  }).sort((a, b) => b.creditUnits - a.creditUnits || b.impactIfA - a.impactIfA);
}
