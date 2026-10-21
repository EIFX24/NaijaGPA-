import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GradeAcademy } from './components/GradeAcademy';
import { CGPAManager } from './components/CGPAManager';
import { FastCalculator } from './components/FastCalculator';
import { ImprovementPlanner } from './components/ImprovementPlanner';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DeadlineCalendar } from './components/DeadlineCalendar';
import { OfflineStudyLibrary } from './components/OfflineStudyLibrary';
import { CloudSyncModal } from './components/CloudSyncModal';
import { AcademicDeadline, Course, StudentProfile } from './types/academic';
import { DEFAULT_INITIAL_PROFILE, INITIAL_DEADLINES } from './data/presetData';
import {
  getStoredTheme,
  loadDeadlinesLocally,
  loadProfileLocally,
  saveDeadlinesLocally,
  saveProfileLocally,
  setStoredTheme,
} from './utils/cryptoStorage';
import { BookOpen, Calculator, Calendar, Compass, Layers, Library, Sparkles, TrendingUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('academy');
  const [isDark, setIsDark] = useState<boolean>(() => getStoredTheme() === 'dark');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Student Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return loadProfileLocally() || DEFAULT_INITIAL_PROFILE;
  });

  // Academic Deadlines State
  const [deadlines, setDeadlines] = useState<AcademicDeadline[]>(() => {
    return loadDeadlinesLocally() || INITIAL_DEADLINES;
  });

  // Dark Mode Sync with DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      setStoredTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setStoredTheme('light');
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark(!isDark);
  };

  // Auto-persist profile
  const handleUpdateProfile = (updated: StudentProfile) => {
    setProfile(updated);
    saveProfileLocally(updated);
  };

  // Auto-persist deadlines
  const handleUpdateDeadlines = (updated: AcademicDeadline[]) => {
    setDeadlines(updated);
    saveDeadlinesLocally(updated);
  };

  const handleUpdateTarget = (newTarget: number) => {
    const updated = { ...profile, targetCGPA: newTarget };
    handleUpdateProfile(updated);
  };

  // Save quick calculator courses into a new semester
  const handleSaveQuickCalcToProfile = (courses: Course[], semesterName: string) => {
    const lastSem = profile.semesters[profile.semesters.length - 1];
    const newLvl = lastSem ? lastSem.level : 100;
    const newNum = (lastSem?.semesterNumber === 1 ? 2 : 1) as 1 | 2;

    const newSemester = {
      id: `sem-${Date.now()}`,
      level: newLvl,
      semesterNumber: newNum,
      name: semesterName || `${newLvl} Level — Fast Calculation`,
      courses,
    };

    const updated = {
      ...profile,
      semesters: [...profile.semesters, newSemester],
    };
    handleUpdateProfile(updated);
    setActiveTab('manager');
  };

  // Import from Cloud Sync / Backup
  const handleImportData = (newProfile: StudentProfile, newDeadlines: AcademicDeadline[]) => {
    handleUpdateProfile(newProfile);
    handleUpdateDeadlines(newDeadlines);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation Bar adhering to the Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDark={toggleDark}
        onOpenSync={() => setIsSyncModalOpen(true)}
        institutionName={profile.institutionName}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Workspace Toolbar / Secondary Switcher */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setActiveTab('academy')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'academy'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learn the Math</span>
            </button>

            <button
              onClick={() => setActiveTab('manager')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'manager'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>CGPA Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('target')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'target'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Target & Improvement</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('quick')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'quick'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Fast Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Deadlines & Exams</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'library'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              <span>Offline Library</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Scale: {profile.scaleType === 'nuc_5_0' ? 'NUC 5.0' : profile.scaleType === 'poly_4_0' ? 'NBTE 4.0' : profile.scaleType === 'ui_7_0' ? 'UI 7.0' : '5.0 (E)'}</span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'academy' && (
          <GradeAcademy onStartCalculating={() => setActiveTab('manager')} />
        )}

        {activeTab === 'manager' && (
          <CGPAManager
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToTarget={() => setActiveTab('target')}
          />
        )}

        {activeTab === 'target' && (
          <ImprovementPlanner
            profile={profile}
            onUpdateTarget={handleUpdateTarget}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard profile={profile} />
        )}

        {activeTab === 'quick' && (
          <FastCalculator
            scaleType={profile.scaleType}
            onSaveToProfile={handleSaveQuickCalcToProfile}
          />
        )}

        {activeTab === 'calendar' && (
          <DeadlineCalendar
            deadlines={deadlines}
            onUpdateDeadlines={handleUpdateDeadlines}
            institutionName={profile.institutionName}
          />
        )}

        {activeTab === 'library' && (
          <OfflineStudyLibrary />
        )}
      </main>

      {/* Cloud Sync & Vault Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        profile={profile}
        deadlines={deadlines}
        onImportData={handleImportData}
      />

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">NaijaGPA</span>
            <span aria-hidden="true">&bull;</span>
            <span>Dedicated to Academic Excellence in Nigerian Tertiary Institutions</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Offline-First Storage Active</span>
            <span aria-hidden="true">&bull;</span>
            <span>End-to-End Encrypted Cloud Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
