import React from 'react';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import { Article } from '../../types.ts';

interface InsightsSectionProps {
  articles?: Article[];
  onSelectArticle: (article: Article) => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  articles = [],
  onSelectArticle,
}) => {
  const safeArticles = articles || [];
  return (
    <section id="articles" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 text-left">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
              <span>Engineering Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Architectural thought leadership & guides
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Practical software engineering philosophies, database patterns, and systems scaling techniques from our senior architects.
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {safeArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 overflow-hidden transition-all duration-300 flex flex-col justify-between text-left cursor-pointer"
            >
              <div>
                <div className="relative h-60 overflow-hidden bg-slate-950">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-cyan-400">
                    {article.category}
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Author and CTA */}
              <div className="p-7 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {article.authorAvatar ? (
                    <img
                      src={article.authorAvatar}
                      alt={article.author}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-cyan-400 font-bold">
                      {article.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{article.author}</p>
                    <p className="text-[10px] text-slate-400">{article.authorRole}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
