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
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6b7280' });

  useEffect(() => {
    let savedPrinciples = storage.getPrinciples(language);
    let savedCategories = storage.getCategories(language);
    
    // If no data exists, load demo data based on language
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
    if (confirm(t('confirmDeletePrinciple', language))) {
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

  // 新增分类
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    const id = generateId();
    const category = {
      id,
      name: newCategory.name.trim(),
      color: newCategory.color,
      createdAt: new Date().toISOString(),
    };
    const updated = [...categories, category];
    setCategories(updated);
    storage.saveCategories(updated, language);
    setShowAddCategory(false);
    setNewCategory({ name: '', color: '#6b7280' });
  };
  // 删除分类
  const handleDeleteCategory = (id: string) => {
    if (!confirm(language === 'zh' ? '确定要删除该分类吗？' : 'Delete this category?')) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    storage.saveCategories(updated, language);
    // 还需同步将所有引用该分类的原则的 category 字段置空
    const updatedPrinciples = principles.map(p => p.category === id ? { ...p, category: '' } : p);
    setPrinciples(updatedPrinciples);
    storage.savePrinciples(updatedPrinciples, language);
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen size={24} className="text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            {t('myInvestmentJournal', language)}
          </h1>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>{t('addPrinciple', language)}</span>
        </button>
      </div>

      {/* Categories Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('category', language)}
              </h3>
              <button
                className="btn-secondary btn-xs flex items-center"
                onClick={() => setShowAddCategory(true)}
                title={language === 'zh' ? '新增分类' : 'Add Category'}
              >
                <Plus size={14} />
              </button>
            </div>
            {/* 新增分类弹窗 */}
            {showAddCategory && (
              <div className="mb-3 p-3 rounded bg-gray-50 border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className={`input flex-1 min-w-[120px] px-3 py-2 ${language === 'en' ? 'text-sm' : 'text-base'}`}
                    placeholder={language === 'zh' ? '分类名' : 'Category Name'}
                    value={newCategory.name}
                    onChange={e => setNewCategory(c => ({ ...c, name: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={e => setNewCategory(c => ({ ...c, color: e.target.value }))}
                    title={language === 'zh' ? '选择颜色' : 'Pick Color'}
                    className="w-8 h-8 border-0 p-0 bg-transparent cursor-pointer"
                    style={{ width: '100%' }}
                  />
                  <button className="btn-primary btn-xs" onClick={handleAddCategory}>
                    {language === 'zh' ? '保存' : 'Save'}
                  </button>
                  <button className="btn-secondary btn-xs" onClick={() => setShowAddCategory(false)}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t('allCategories', language)}
              </button>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center group">
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </button>
                  <button
                    className="ml-1 text-gray-400 hover:text-red-500 invisible group-hover:visible"
                    title={language === 'zh' ? '删除分类' : 'Delete Category'}
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Principles List */}
        <div className="flex-1">
          {filteredPrinciples.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                {t('noPrinciples', language)}
              </div>
              <p className="text-gray-500 text-sm">
                {language === 'zh' ? '开始记录你的投资原则' : 'Start recording your investment principles'}
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

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingPrinciple) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPrinciple ? t('edit', language) : t('addPrinciple', language)}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                {t('cancel', language)}
              </button>
              <button
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

// Principle Card Component
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
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="card p-6 relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Left border for learned principles */}
      {principle.type === 'learned' && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: categoryColor }}
        />
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          {/* Category tag */}
          <div className="flex items-center space-x-2 mb-3">
            <span 
              className="tag text-xs"
              style={{ 
                backgroundColor: `${categoryColor}20`, 
                color: categoryColor,
                border: `1px solid ${categoryColor}40`
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
          
          {/* Principle content */}
          <p className="text-gray-900 leading-relaxed">
            {principle.content}
          </p>
          
          {/* Source trade link */}
          {principle.sourceTradeId && (
            <div className="mt-3">
              <Link
                to={`/edit/${principle.sourceTradeId}`}
                className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800"
              >
                <ExternalLink size={12} />
                <span>{t('sourceTrade', language)}</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className={`flex items-center space-x-1 transition-opacity ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={onEdit}
            className="btn-secondary p-2"
            title={t('edit', language)}
          >
            <Edit size={14} />
          </button>
          <button
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