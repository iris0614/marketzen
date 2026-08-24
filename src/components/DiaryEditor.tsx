import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Plus,
  GripVertical,
  LucideIcon,
} from 'lucide-react';
import { DiaryBlock, DiaryBlockType, DiaryEntry, Language } from '../types';
import { t } from '../i18n';
import { generateId } from '../utils/calculations';

interface DiaryEditorProps {
  entry: DiaryEntry;
  language: Language;
  onChange: (entry: DiaryEntry) => void;
}

interface SlashItem {
  type: DiaryBlockType;
  labelKey: string;
  aliases: string[];
  icon: LucideIcon;
}

const SLASH_ITEMS: SlashItem[] = [
  { type: 'paragraph', labelKey: 'blockParagraph', aliases: ['text', 'p', '正文'], icon: Type },
  { type: 'heading1', labelKey: 'blockHeading1', aliases: ['h1', 'title', '标题'], icon: Heading1 },
  { type: 'heading2', labelKey: 'blockHeading2', aliases: ['h2'], icon: Heading2 },
  { type: 'heading3', labelKey: 'blockHeading3', aliases: ['h3'], icon: Heading3 },
  { type: 'bullet', labelKey: 'blockBullet', aliases: ['ul', 'list', '列表'], icon: List },
  { type: 'numbered', labelKey: 'blockNumbered', aliases: ['ol', '1'], icon: ListOrdered },
  { type: 'todo', labelKey: 'blockTodo', aliases: ['todo', 'task', '待办'], icon: CheckSquare },
  { type: 'quote', labelKey: 'blockQuote', aliases: ['quote', '引言'], icon: Quote },
  { type: 'divider', labelKey: 'blockDivider', aliases: ['div', 'hr', '分割'], icon: Minus },
];

const SHORTCUTS: Record<string, DiaryBlockType> = {
  '#': 'heading1',
  '##': 'heading2',
  '###': 'heading3',
  '-': 'bullet',
  '*': 'bullet',
  '>': 'quote',
  '[]': 'todo',
  '[ ]': 'todo',
  '1.': 'numbered',
  '---': 'divider',
};

export const createEmptyBlock = (type: DiaryBlockType = 'paragraph'): DiaryBlock => ({
  id: generateId(),
  type,
  text: '',
  checked: type === 'todo' ? false : undefined,
});

export const createEmptyEntry = (date: string): DiaryEntry => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: '',
    date,
    blocks: [createEmptyBlock()],
    createdAt: now,
    updatedAt: now,
  };
};

const placeCaretEnd = (el: HTMLElement) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
};

const BlockText: React.FC<{
  block: DiaryBlock;
  placeholder: string;
  className: string;
  onText: (text: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onFocus: () => void;
}> = ({ block, placeholder, className, onText, onKeyDown, onFocus }) => {
  const ref = useRef<HTMLDivElement>(null);
  const composing = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerText !== (block.text || '')) {
      el.innerText = block.text || '';
    }
  }, [block.id, block.type, block.text]);

  return (
    <div
      ref={ref}
      data-block-id={block.id}
      contentEditable
      role="textbox"
      aria-multiline="false"
      suppressContentEditableWarning
      className={`outline-none min-h-[1.6em] w-full ${className}`}
      data-placeholder={placeholder}
      onFocus={onFocus}
      onCompositionStart={() => {
        composing.current = true;
      }}
      onCompositionEnd={(event) => {
        composing.current = false;
        onText((event.currentTarget.innerText || '').replace(/\n/g, ''));
      }}
                    onInput={(event) => {
                      if (composing.current) return;
                      const text = (event.currentTarget.innerText || '').replace(/\n/g, '');
                      if (!text) event.currentTarget.innerHTML = '';
                      onText(text);
                    }}
      onKeyDown={onKeyDown}
    />
  );
};

const DiaryEditor: React.FC<DiaryEditorProps> = ({ entry, language, onChange }) => {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [slash, setSlash] = useState<{ blockId: string; query: string; index: number } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!focusId) return;
    const el = document.querySelector(`[data-block-id="${focusId}"]`) as HTMLElement | null;
    if (el) {
      el.focus();
      placeCaretEnd(el);
    }
    setFocusId(null);
  }, [focusId, entry.blocks]);

  const update = (patch: Partial<DiaryEntry>) => {
    onChange({ ...entry, ...patch, updatedAt: new Date().toISOString() });
  };

  const setBlocks = (blocks: DiaryBlock[]) => update({ blocks });

  const updateBlock = (id: string, patch: Partial<DiaryBlock>) => {
    setBlocks(entry.blocks.map(block => (block.id === id ? { ...block, ...patch } : block)));
  };

  const convertBlock = (id: string, type: DiaryBlockType, text = '') => {
    setBlocks(entry.blocks.map(block => (
      block.id === id
        ? { ...block, type, text, checked: type === 'todo' ? Boolean(block.checked) : undefined }
        : block
    )));
    setSlash(null);
    setFocusId(id);
  };

  const insertAfter = (id: string, type: DiaryBlockType = 'paragraph') => {
    const index = entry.blocks.findIndex(block => block.id === id);
    const next = createEmptyBlock(type);
    const blocks = [...entry.blocks];
    blocks.splice(index + 1, 0, next);
    setBlocks(blocks);
    setFocusId(next.id);
    return next.id;
  };

  const handleText = (block: DiaryBlock, text: string) => {
    updateBlock(block.id, { text });
    if (text.startsWith('/')) {
      setSlash({
        blockId: block.id,
        query: text.slice(1),
        index: slash?.blockId === block.id ? slash.index : 0,
      });
    } else if (slash?.blockId === block.id) {
      setSlash(null);
    }
  };

  const filteredSlash = useMemo(() => {
    if (!slash) return [];
    const q = slash.query.toLowerCase().trim();
    if (!q) return SLASH_ITEMS;
    return SLASH_ITEMS.filter(item => {
      const label = t(item.labelKey, language).toLowerCase();
      return label.includes(q) || item.aliases.some(alias => alias.includes(q));
    });
  }, [slash, language]);

  const applySlash = (type: DiaryBlockType) => {
    if (!slash) return;
    convertBlock(slash.blockId, type, '');
  };

  const handleKeyDown = (block: DiaryBlock, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (slash && slash.blockId === block.id) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSlash(prev => prev ? { ...prev, index: Math.min(prev.index + 1, Math.max(filteredSlash.length - 1, 0)) } : prev);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSlash(prev => prev ? { ...prev, index: Math.max(prev.index - 1, 0) } : prev);
        return;
      }
      if (event.key === 'Enter' && filteredSlash[slash.index]) {
        event.preventDefault();
        applySlash(filteredSlash[slash.index].type);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setSlash(null);
        return;
      }
    }

    if (event.key === ' ' && !event.nativeEvent.isComposing) {
      const token = block.text.trim();
      const nextType = SHORTCUTS[token];
      if (nextType) {
        event.preventDefault();
        convertBlock(block.id, nextType, '');
        return;
      }
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (block.text.startsWith('/')) return;
      insertAfter(block.id, block.type === 'heading1' || block.type === 'heading2' || block.type === 'heading3' || block.type === 'divider' ? 'paragraph' : block.type);
      return;
    }

    if (event.key === 'Backspace' && block.text === '') {
      const index = entry.blocks.findIndex(item => item.id === block.id);
      if (block.type !== 'paragraph') {
        event.preventDefault();
        convertBlock(block.id, 'paragraph', '');
        return;
      }
      if (index > 0) {
        event.preventDefault();
        const prev = entry.blocks[index - 1];
        setBlocks(entry.blocks.filter(item => item.id !== block.id));
        if (prev.type !== 'divider') setFocusId(prev.id);
      }
    }
  };

  const numberedIndex = (index: number) => {
    let count = 1;
    for (let i = index - 1; i >= 0; i -= 1) {
      if (entry.blocks[i].type === 'numbered') count += 1;
      else break;
    }
    return count;
  };

  const blockClass = (type: DiaryBlockType) => {
    switch (type) {
      case 'heading1':
        return 'font-serif text-[1.75rem] sm:text-[2rem] font-medium leading-tight text-ink';
      case 'heading2':
        return 'font-serif text-xl sm:text-2xl font-medium leading-snug text-ink';
      case 'heading3':
        return 'font-serif text-lg font-medium text-ink';
      case 'quote':
        return 'text-[15px] leading-relaxed text-ink-muted italic';
      default:
        return 'text-[15px] leading-[1.75] text-ink';
    }
  };

  return (
    <div className="min-w-0">
      <input
        value={entry.title}
        onChange={(event) => update({ title: event.target.value })}
        placeholder={t('diaryTitlePlaceholder', language)}
        className="w-full bg-transparent border-0 outline-none font-serif text-3xl sm:text-[2.4rem] text-ink placeholder:text-ink-faint tracking-tight mb-3 px-1"
      />
      <label className="flex items-center gap-2 text-xs text-ink-faint mb-8 px-1">
        <span>{t('diaryDate', language)}</span>
        <input
          type="date"
          value={entry.date}
          onChange={(event) => update({ date: event.target.value })}
          className="bg-transparent border-0 outline-none text-ink-muted text-sm cursor-pointer"
        />
      </label>

      <div className="space-y-0.5">
        {entry.blocks.map((block, index) => {
          const showSlash = slash?.blockId === block.id && filteredSlash.length > 0;
          return (
            <div
              key={`${block.id}-${block.type}`}
              className="relative group"
              onMouseEnter={() => setHovered(block.id)}
              onMouseLeave={() => setHovered(prev => (prev === block.id ? null : prev))}
            >
              <div className="absolute -left-10 top-1 hidden md:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="p-0.5 rounded-md text-ink-faint hover:bg-paper-200 hover:text-ink"
                  title={t('newDiaryPage', language)}
                  onClick={() => {
                    const id = insertAfter(block.id);
                    setSlash({ blockId: id, query: '', index: 0 });
                  }}
                >
                  <Plus size={14} />
                </button>
                <span className="text-ink-faint">
                  <GripVertical size={14} />
                </span>
              </div>

              {block.type === 'divider' ? (
                <button
                  type="button"
                  className="w-full py-3 px-1"
                  onClick={() => setHovered(block.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' || event.key === 'Delete') {
                      const prev = entry.blocks[Math.max(index - 1, 0)];
                      setBlocks(entry.blocks.filter(item => item.id !== block.id));
                      if (prev) setFocusId(prev.id);
                    }
                    if (event.key === 'Enter') insertAfter(block.id);
                  }}
                >
                  <span className="block h-px w-full bg-paper-500" />
                </button>
              ) : (
                <div className={`flex items-start gap-2 px-1 py-0.5 rounded-[8px] ${hovered === block.id ? 'bg-paper-200/50' : ''}`}>
                  {block.type === 'bullet' && (
                    <span className="mt-[0.55rem] w-1.5 h-1.5 rounded-full bg-ink shrink-0" />
                  )}
                  {block.type === 'numbered' && (
                    <span className="mt-1 text-sm text-ink-muted w-5 shrink-0 text-right">{numberedIndex(index)}.</span>
                  )}
                  {block.type === 'todo' && (
                    <button
                      type="button"
                      className={`mt-1.5 w-4 h-4 rounded border shrink-0 ${
                        block.checked ? 'bg-sage-500 border-sage-500' : 'border-paper-500 bg-paper-50'
                      }`}
                      onClick={() => updateBlock(block.id, { checked: !block.checked })}
                      aria-label={t('blockTodo', language)}
                    />
                  )}
                  {block.type === 'quote' && (
                    <span className="mt-1 w-0.5 self-stretch min-h-[1.4em] bg-clay-400 rounded-full shrink-0" />
                  )}
                  <BlockText
                    block={block}
                    placeholder={index === 0 && !block.text ? t('diaryPlaceholder', language) : ''}
                    className={`${blockClass(block.type)} ${block.checked ? 'line-through text-ink-faint' : ''} ${!block.text ? 'diary-empty' : ''}`}
                    onText={(text) => handleText(block, text)}
                    onFocus={() => {
                      if (block.text.startsWith('/')) {
                        setSlash({ blockId: block.id, query: block.text.slice(1), index: 0 });
                      }
                    }}
                    onKeyDown={(event) => handleKeyDown(block, event)}
                  />
                </div>
              )}

              {showSlash && (
                <div className="absolute z-20 left-6 top-full mt-1 w-64 card p-1.5 shadow-medium">
                  {filteredSlash.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const active = itemIndex === slash.index;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-sm text-left ${
                          active ? 'bg-paper-200 text-ink' : 'text-ink-muted hover:bg-paper-200'
                        }`}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          applySlash(item.type);
                        }}
                      >
                        <span className="w-7 h-7 rounded-lg bg-paper-50 border border-paper-400 flex items-center justify-center text-ink">
                          <Icon size={14} />
                        </span>
                        {t(item.labelKey, language)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-faint mt-8 px-1">{t('slashHint', language)}</p>
    </div>
  );
};

export default DiaryEditor;
