import React, { useState } from 'react';
import { BookOpen, CheckCircle, Search, Clock, ArrowLeft, Download, WifiOff } from 'lucide-react';
import { STUDY_LIBRARY_ARTICLES } from '../data/presetData';
import { StudyArticle } from '../types/academic';

export const OfflineStudyLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<StudyArticle | null>(null);

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'ca_mastery', label: 'CA Mastery (30/40 Marks)' },
    { id: 'cgpa_strategy', label: 'CGPA Strategy & Math' },
    { id: 'exam_technique', label: 'Exam Technique & TDB' },
    { id: 'tackling_carryovers', label: 'Tackling Carryovers' },
  ];

  const filteredArticles = STUDY_LIBRARY_ARTICLES.filter((art) => {
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return art.title.toLowerCase().includes(q) || art.summary.toLowerCase().includes(q);
  });

  if (activeArticle) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        <button
          onClick={() => setActiveArticle(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library Guides</span>
        </button>

        <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm space-y-8">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {activeArticle.category.replace('_', ' ')}
              </span>
              <span aria-hidden="true">&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeArticle.readTime}</span>
              </span>
              <span aria-hidden="true">&bull;</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Saved for Offline Reading</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {activeArticle.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              {activeArticle.summary}
            </p>
          </div>

          {/* Key Takeaways Box */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Essential Rules & Takeaways
            </h3>
            <ul className="space-y-1.5">
              {activeArticle.keyTakeaways.map((point, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">&bull;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full Article Content */}
          <div className="space-y-5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {activeArticle.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              NaijaGPA Academic Mastery Series &bull; For Nigerian Tertiary Students
            </span>
            <button
              onClick={() => setActiveArticle(null)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner with generated night study image */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                <WifiOff className="w-4 h-4" />
                <span>100% Offline Accessible &bull; Zero Data Required</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
                The Nigerian Student Academic Library
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Field-tested strategies for acing university Continuous Assessment (CA), mastering 3-unit courses, overcoming carryovers, and swapping all-night cramming for high-retention study routines.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>All articles are cached locally on your device for late-night study sessions.</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/library_study_night_1792601205121.jpg"
              alt="Night study desk with books and calculator"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Unboxed metadata row (Anti-slop) */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {article.category.replace('_', ' ')}
                </span>
                <span aria-hidden="true">&bull;</span>
                <span>{article.readTime}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {article.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Available Offline</span>
              </span>

              <button
                onClick={() => setActiveArticle(article)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors cursor-pointer"
              >
                Read Guide &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
