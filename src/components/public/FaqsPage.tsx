import React, { useState } from 'react';
import { 
  ChevronRight, Plus, Minus, HelpCircle, 
  ArrowRight, Search, ShieldCheck 
} from 'lucide-react';
import { FAQS_DATA } from '../../data/nexusData.ts';

interface FaqsPageProps {
  onNavigateSection: (page: string) => void;
  onRequestQuote: () => void;
}

export const FaqsPage: React.FC<FaqsPageProps> = ({
  onNavigateSection,
  onRequestQuote,
}) => {
  const [openId, setOpenId] = useState<string | null>(FAQS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS_DATA.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[oklch(0.32_0.04_165)] text-slate-100">
      
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[oklch(0.36_0.045_165)] to-[oklch(0.32_0.04_165)] pt-8 pb-16">
        <div className="container-x">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <button 
              onClick={() => onNavigateSection('home')} 
              className="hover:text-gold transition-colors"
            >
              Home
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-gold font-semibold">FAQs</span>
          </nav>

          <div className="max-w-3xl">
            <p className="eyebrow mb-3">FAQs</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
              Answers to the questions <span className="text-gradient-gold">we hear most</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              Everything you would want to know before partnering with SaaSLink — IP ownership, pricing, delivery cycles, and data protection.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. IP ownership, timeline, M-Pesa, pricing)..."
              className="w-full rounded-2xl border border-white/15 bg-black/25 pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:border-gold focus:outline-none backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <section className="container-x py-16">
        <div className="mx-auto max-w-3xl divide-y divide-white/10 rounded-3xl border border-white/10 bg-[oklch(0.36_0.045_165/0.6)] backdrop-blur-sm overflow-hidden">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <HelpCircle className="mx-auto h-10 w-10 text-slate-500 mb-3" />
              <p className="text-base font-medium text-white">No matching answers found</p>
              <p className="text-xs text-slate-400 mt-1">Try another search term or ask our engineering team directly.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className={`transition-colors ${isOpen ? 'bg-[oklch(0.41_0.045_165/0.6)]' : 'hover:bg-white/[0.02]'}`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 p-6 sm:p-7 text-left cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-semibold text-white">
                      {faq.q}
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-gold">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-7 sm:px-7 text-sm text-slate-300 leading-relaxed animate-fade-up">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Shared CTA Banner */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.78_0.12_78/0.3)] bg-gradient-to-br from-[oklch(0.34_0.05_165)] to-[oklch(0.26_0.04_165)] p-10 sm:p-14 shadow-elegant">
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow mb-3">Still have questions?</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Talk directly to a senior systems architect.
              </h2>
              <p className="mt-4 max-w-xl text-slate-300 text-base leading-relaxed">
                We are happy to jump on a quick 15-minute call to answer technical queries, discuss architecture, or review an RFP.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:justify-end gap-3">
              <button
                onClick={onRequestQuote}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-4 font-semibold text-[oklch(0.22_0.03_165)] shadow-gold transition-transform hover:-translate-y-0.5 cursor-pointer text-sm"
              >
                <span>Request a Quotation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
