import React, { useEffect, useMemo, useState } from 'react';
import { Search, Quote, X } from 'lucide-react';
import { AppSettings, InvestmentNote, Language, NoteTag } from '../types';
import { t } from '../i18n';
import { investmentNotes, NOTE_TAGS } from '../data/investmentNotes';

interface NotesProps {
  settings: AppSettings;
}

const tagKey = (tag: NoteTag) => {
  const map: Record<NoteTag, string> = {
    value: 'tagValue',
    psychology: 'tagPsychology',
    cycle: 'tagCycle',
    risk: 'tagRisk',
    trading: 'tagTrading',
    philosophy: 'tagPhilosophy',
    biography: 'tagBiography',
    china: 'tagChina',
    index: 'tagIndex',
    growth: 'tagGrowth',
    macro: 'tagMacro',
    behavioral: 'tagBehavioral',
    fundamentals: 'tagFundamentals',
    business: 'tagBusiness',
  };
  return map[tag];
};

const BookCard: React.FC<{
  note: InvestmentNote;
  language: Language;
  onOpen: () => void;
}> = ({ note, language, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="card text-left w-full overflow-hidden group hover:shadow-medium hover:border-paper-500 transition-all duration-300"
  >
    <div className="flex min-h-[220px]">
      <div
        className="w-3 sm:w-4 shrink-0"
        style={{ backgroundColor: note.cover }}
        aria-hidden
      />
      <div className="flex-1 p-5 sm:p-6 flex flex-col">
        <p className="text-[11px] tracking-[0.16em] uppercase text-ink-faint mb-2">
          {note.author[language]} · {note.year}
        </p>
        <h3 className="font-serif text-xl text-ink leading-snug mb-3 group-hover:text-clay-700 transition-colors">
          {note.title[language]}
        </h3>
        <p className="font-serif italic text-[15px] text-ink-muted leading-relaxed flex-1 line-clamp-3">
          “{note.quote[language]}”
        </p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag tag-gray">
              {t(tagKey(tag), language)}
            </span>
          ))}
        </div>
      </div>
    </div>
  </button>
);

const Notes: React.FC<NotesProps> = ({ settings }) => {
  const { language } = settings;
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<NoteTag | 'all'>('all');
  const [selected, setSelected] = useState<InvestmentNote | null>(null);

  useEffect(() => {
    if (!selected) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return investmentNotes.filter((note) => {
      if (activeTag !== 'all' && !note.tags.includes(activeTag)) return false;
      if (!q) return true;
      const hay = [
        note.title.zh,
        note.title.en,
        note.author.zh,
        note.author.en,
        note.quote.zh,
        note.quote.en,
        note.insight.zh,
        note.insight.en,
        ...note.tags.map((tag) => t(tagKey(tag), language)),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, activeTag, language]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-ink-faint mb-2">
            {filtered.length} {t('booksCount', language)}
          </p>
          <h1 className="page-title mb-2">{t('investmentNotes', language)}</h1>
          <p className="text-ink-muted max-w-xl leading-relaxed">
            {t('notesSubtitle', language)}
          </p>
        </div>
      </div>

      <div className="card p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchNotes', language)}
            className="input pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag('all')}
            className={`tag ${activeTag === 'all' ? 'tag-primary' : 'tag-gray'}`}
          >
            {t('allTags', language)}
          </button>
          {NOTE_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(prev => (prev === tag ? 'all' : tag))}
              className={`tag ${activeTag === tag ? 'tag-primary' : 'tag-gray'}`}
            >
              {t(tagKey(tag), language)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="font-serif text-xl text-ink-muted mb-2">{t('noNotes', language)}</p>
          <p className="text-sm text-ink-faint">{t('tryOtherKeywords', language)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((note) => (
            <BookCard
              key={note.id}
              note={note}
              language={language}
              onOpen={() => setSelected(note)}
            />
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-ink/35"
            aria-label={t('closeDetail', language)}
            onClick={() => setSelected(null)}
          />
          <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-[20px] sm:rounded-[12px] animate-slide-up">
            <div className="h-2 w-full" style={{ backgroundColor: selected.cover }} />
            <div className="p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 p-2 rounded-[12px] text-ink-muted hover:bg-paper-200"
                aria-label={t('closeDetail', language)}
              >
                <X size={18} />
              </button>
              <p className="text-[11px] tracking-[0.16em] uppercase text-ink-faint mb-2">
                {selected.author[language]} · {t('publishedYear', language)} {selected.year}
              </p>
              <h2 className="font-serif text-3xl text-ink mb-5 pr-8">
                {selected.title[language]}
              </h2>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {selected.tags.map((tag) => (
                  <span key={tag} className="tag tag-primary">
                    {t(tagKey(tag), language)}
                  </span>
                ))}
              </div>
              <div className="bg-paper-200 rounded-[12px] p-5 mb-6 border border-paper-400">
                <div className="flex items-center gap-2 text-ink-faint mb-2">
                  <Quote size={14} />
                  <span className="text-xs tracking-widest uppercase">{t('coreQuote', language)}</span>
                </div>
                <p className="font-serif italic text-lg text-ink leading-relaxed">
                  “{selected.quote[language]}”
                </p>
              </div>
              <p className="text-xs tracking-widest uppercase text-ink-faint mb-2">
                {t('readingNotes', language)}
              </p>
              <p className="text-[15px] text-ink leading-[1.85] whitespace-pre-wrap">
                {selected.insight[language]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
