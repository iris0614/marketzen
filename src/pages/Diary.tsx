import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { PenLine, Plus, Search, Trash2 } from 'lucide-react';
import { AppSettings, DiaryEntry } from '../types';
import { t } from '../i18n';
import { storage } from '../utils/storage';
import { toLocalDateString } from '../utils/calculations';
import DiaryEditor, { createEmptyEntry } from '../components/DiaryEditor';

interface DiaryProps {
  settings: AppSettings;
}

const previewOf = (entry: DiaryEntry, fallback: string) => {
  const line = entry.blocks.find(block => block.type !== 'divider' && block.text.trim());
  return line?.text.trim() || fallback;
};

const Diary: React.FC<DiaryProps> = ({ settings }) => {
  const { language } = settings;
  const [entries, setEntries] = useState<DiaryEntry[]>(() => storage.getDiaryEntries());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const entriesRef = useRef(entries);
  const saveTimer = useRef<number>();

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    return () => {
      window.clearTimeout(saveTimer.current);
      storage.saveDiaryEntries(entriesRef.current);
    };
  }, []);

  const persist = (next: DiaryEntry[]) => {
    entriesRef.current = next;
    setEntries(next);
    setSaving(true);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      storage.saveDiaryEntries(next);
      setSaving(false);
    }, 350);
  };

  const sorted = useMemo(
    () => [...entries].sort((a, b) => {
      if (a.date === b.date) return b.updatedAt.localeCompare(a.updatedAt);
      return b.date.localeCompare(a.date);
    }),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(entry => {
      const hay = [
        entry.title,
        entry.date,
        ...entry.blocks.map(block => block.text),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [sorted, query]);

  const active = entries.find(entry => entry.id === (activeId || filtered[0]?.id));

  useEffect(() => {
    if (!activeId && filtered[0]) setActiveId(filtered[0].id);
  }, [activeId, filtered]);

  const handleCreate = () => {
    const page = createEmptyEntry(toLocalDateString(new Date()));
    persist([page, ...entries]);
    setActiveId(page.id);
    setQuery('');
  };

  const handleChange = (updated: DiaryEntry) => {
    persist(entries.map(entry => (entry.id === updated.id ? updated : entry)));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t('confirmDeleteDiary', language))) return;
    const next = entries.filter(entry => entry.id !== id);
    persist(next);
    setActiveId(next[0]?.id ?? null);
  };

  const locale = language === 'zh' ? zhCN : enUS;
  const formatDate = (value: string) => {
    try {
      return format(parseISO(value), language === 'zh' ? 'M月d日 EEE' : 'MMM d, EEE', { locale });
    } catch {
      return value;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[70vh]">
      <aside className="lg:w-64 shrink-0">
        <div className="card p-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-serif text-lg text-ink">{t('diaryTitle', language)}</h1>
            <button
              type="button"
              onClick={handleCreate}
              className="btn-primary btn-xs flex items-center gap-1"
            >
              <Plus size={14} />
              <span>{t('newDiaryPage', language)}</span>
            </button>
          </div>
          <p className="text-[11px] text-ink-faint leading-relaxed mb-3">{t('diarySubtitle', language)}</p>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('diarySearch', language)}
              className="input pl-8 py-1.5 text-sm"
            />
          </div>
          <div className="space-y-1 max-h-[52vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-ink-faint px-2 py-6 text-center">
                {t('noDiary', language)}
              </p>
            ) : (
              filtered.map(entry => {
                const isActive = entry.id === active?.id;
                return (
                  <div
                    key={entry.id}
                    className={`group flex items-start gap-1 rounded-[12px] ${
                      isActive ? 'bg-clay-50' : 'hover:bg-paper-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(entry.id)}
                      className="flex-1 text-left px-3 py-2 min-w-0"
                    >
                      <p className={`text-sm truncate ${isActive ? 'text-clay-700 font-medium' : 'text-ink'}`}>
                        {entry.title.trim() || t('untitledPage', language)}
                      </p>
                      <p className="text-[11px] text-ink-faint mt-0.5">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-xs text-ink-muted truncate mt-0.5">
                        {previewOf(entry, t('emptyDiaryPreview', language))}
                      </p>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-ink-faint hover:text-rose-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                      onClick={() => handleDelete(entry.id)}
                      title={t('delete', language)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>

      <section className="flex-1 min-w-0">
        {active ? (
          <div className="card px-5 py-8 sm:px-10 sm:py-12">
            <div className="flex justify-end mb-2">
              <span className="text-[11px] tracking-wide text-ink-faint">
                {saving ? t('saving', language) : t('savedJustNow', language)}
              </span>
            </div>
            <DiaryEditor
              key={active.id}
              entry={active}
              language={language}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="card px-6 py-16 text-center">
            <PenLine size={28} className="mx-auto text-clay-400 mb-4" />
            <h2 className="font-serif text-2xl text-ink mb-2">{t('noDiary', language)}</h2>
            <p className="text-ink-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
              {t('noDiaryHint', language)}
            </p>
            <button type="button" onClick={handleCreate} className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              {t('newDiaryPage', language)}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Diary;
