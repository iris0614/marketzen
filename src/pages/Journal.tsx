import React, { useState, useEffect } from 'react';
import { InvestmentPrinciple, PrincipleCategory, AppSettings } from '../types';
import { storage } from '../utils/storage';
import { generateId } from '../utils/calculations';
import { getDemoPrinciples, getDemoCategories } from '../utils/demoData';
import { t } from '../i18n';
import { Plus, Edit, Trash2, BookOpen, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JournalProps {
  settings: AppSettings;
  onPrincipleChange: () => void;
}

const Journal: React.FC<JournalProps> = ({ settings, onPrincipleChange }) => {
  const { language } = settings;
  const [principles, setPrinciples] = useState<InvestmentPrinciple[]>([]);
  const [categories, setCategories] = useState<PrincipleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrinciple, setEditingPrinciple] = useState<InvestmentPrinciple | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    category: '',
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#c17b5c' });

  useEffect(() => {
    let savedPrinciples = storage.getPrinciples(language);
    let savedCategories = storage.getCategories(language);

    if (savedPrinciples.length === 0) {
      savedPrinciples = getDemoPrinciples(language);
      storage.savePrinciples(savedPrinciples, language);
    }

    if (savedCategories.length === 0) {
      savedCategories = getDemoCategories(language);
      storage.saveCategories(savedCategories, language);
    }

    setPrinciples(savedPrinciples);
    setCategories(savedCategories);
  }, [language]);

  const filteredPrinciples = selectedCategory === 'all'
    ? principles
    : principles.filter(p => p.category === selectedCategory);

  const handleAddPrinciple = () => {
    if (formData.content.trim() && formData.category) {
      const newPrinciple: InvestmentPrinciple = {
        id: generateId(),
        content: formData.content.trim(),
        category: formData.category,
        type: 'general',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedPrinciples = [...principles, newPrinciple];
      setPrinciples(updatedPrinciples);
      storage.addPrinciple(newPrinciple, language);
      onPrincipleChange();

      setFormData({ content: '', category: '' });
      setShowAddForm(false);
    }
  };

  const handleEditPrinciple = () => {
    if (editingPrinciple && formData.content.trim() && formData.category) {
      const updatedPrinciple = {
        ...editingPrinciple,
        content: formData.content.trim(),
        category: formData.category,
        updatedAt: new Date().toISOString(),
      };

      const updatedPrinciples = principles.map(p =>
        p.id === editingPrinciple.id ? updatedPrinciple : p
      );
      setPrinciples(updatedPrinciples);
      storage.updatePrinciple(editingPrinciple.id, updatedPrinciple, language);
      onPrincipleChange();

      setFormData({ content: '', category: '' });
      setEditingPrinciple(null);
    }
  };

  const handleDeletePrinciple = (id: string) => {
    if (window.confirm(t('confirmDeletePrinciple', language))) {
      const updatedPrinciples = principles.filter(p => p.id !== id);
      setPrinciples(updatedPrinciples);
      storage.deletePrinciple(id, language);
      onPrincipleChange();
    }
  };

  const handleEdit = (principle: InvestmentPrinciple) => {
    setEditingPrinciple(principle);
    setFormData({
      content: principle.content,
      category: principle.category,
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPrinciple(null);
    setFormData({ content: '', category: '' });
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    const category = {
      id: generateId(),
      name: newCategory.name.trim(),
      color: newCategory.color,
      createdAt: new Date().toISOString(),
    };
    const updated = [...categories, category];
    setCategories(updated);
    storage.saveCategories(updated, language);
    setShowAddCategory(false);
    setNewCategory({ name: '', color: '#c17b5c' });
  };

  const handleDeleteCategory = (id: string) => {
    if (!window.confirm(t('deleteCategory', language))) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    storage.saveCategories(updated, language);
    const updatedPrinciples = principles.map(p => p.category === id ? { ...p, category: '' } : p);
    setPrinciples(updatedPrinciples);
    storage.savePrinciples(updatedPrinciples, language);
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#7a7068';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <BookOpen size={22} className="text-clay-500" />
          <h1 className="page-title mb-0">
            {t('myInvestmentJournal', language)}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2 self-start"
        >
          <Plus size={16} />
          <span>{t('addPrinciple', language)}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-ink">
                {t('category', language)}
              </h3>
              <button
                type="button"
                className="btn-secondary btn-xs flex items-center"
                onClick={() => setShowAddCategory(true)}
                title={t('addCategory', language)}
              >
                <Plus size={14} />
              </button>
            </div>
            {showAddCategory && (
              <div className="mb-3 p-3 rounded-[12px] bg-paper-200 border border-paper-400 flex flex-col gap-2">
                <input
                  type="text"
                  className="input"
                  placeholder={t('categoryName', language)}
                  value={newCategory.name}
                  onChange={e => setNewCategory(c => ({ ...c, name: e.target.value }))}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={e => setNewCategory(c => ({ ...c, color: e.target.value }))}
                    title={t('addCategory', language)}
                    className="w-8 h-8 border-0 p-0 bg-transparent cursor-pointer"
                  />
                  <button type="button" className="btn-primary btn-xs" onClick={handleAddCategory}>
                    {t('save', language)}
                  </button>
                  <button type="button" className="btn-secondary btn-xs" onClick={() => setShowAddCategory(false)}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-[12px] text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-clay-50 text-clay-700'
                    : 'text-ink-muted hover:bg-paper-200'
                }`}
              >
                {t('allCategories', language)}
              </button>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center group">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-[12px] text-sm transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.id
                        ? 'bg-clay-50 text-clay-700'
                        : 'text-ink-muted hover:bg-paper-200'
                    }`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </button>
                  <button
                    type="button"
                    className="ml-1 text-ink-faint hover:text-rose-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1"
                    title={t('delete', language)}
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {filteredPrinciples.length === 0 ? (
            <div className="text-center py-14 card">
              <div className="font-serif text-xl text-ink-muted mb-2">
                {t('noPrinciples', language)}
              </div>
              <p className="text-ink-faint text-sm">
                {t('startRecordingPrinciples', language)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrinciples.map((principle) => (
                <PrincipleCard
                  key={principle.id}
                  principle={principle}
                  categoryName={getCategoryName(principle.category)}
                  categoryColor={getCategoryColor(principle.category)}
                  onEdit={() => handleEdit(principle)}
                  onDelete={() => handleDeletePrinciple(principle.id)}
                  settings={settings}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {(showAddForm || editingPrinciple) && (
        <div className="fixed inset-0 bg-ink/35 flex items-center justify-center p-4 z-50">
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-serif text-lg text-ink mb-4">
              {editingPrinciple ? t('edit', language) : t('addPrinciple', language)}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">
                  {t('principle', language)}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={t('principlePlaceholder', language)}
                  className="input h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">
                  {t('category', language)}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">{t('selectCategory', language)}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button type="button" onClick={handleCancel} className="btn-secondary">
                {t('cancel', language)}
              </button>
              <button
                type="button"
                onClick={editingPrinciple ? handleEditPrinciple : handleAddPrinciple}
                className="btn-primary"
              >
                {t('save', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PrincipleCardProps {
  principle: InvestmentPrinciple;
  categoryName: string;
  categoryColor: string;
  onEdit: () => void;
  onDelete: () => void;
  settings: AppSettings;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({
  principle,
  categoryName,
  categoryColor,
  onEdit,
  onDelete,
  settings,
}) => {
  const { language } = settings;

  return (
    <div className="card p-6 relative group">
      {principle.type === 'learned' && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[12px]"
          style={{ backgroundColor: categoryColor }}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span
              className="tag text-xs"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
                border: `1px solid ${categoryColor}40`,
              }}
            >
              {categoryName}
            </span>
            {principle.type === 'learned' && (
              <span className="tag tag-primary text-xs">
                {t('learnedPrinciple', language)}
              </span>
            )}
          </div>

          <p className="text-ink leading-relaxed">
            {principle.content}
          </p>

          {principle.sourceTradeId && (
            <div className="mt-3">
              <Link
                to={`/edit/${principle.sourceTradeId}`}
                className="inline-flex items-center space-x-1 text-sm text-clay-600 hover:text-clay-700"
              >
                <ExternalLink size={12} />
                <span>{t('sourceTrade', language)}</span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="btn-secondary p-2"
            title={t('edit', language)}
          >
            <Edit size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="btn-danger p-2"
            title={t('delete', language)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Journal;
