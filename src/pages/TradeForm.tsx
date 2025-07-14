import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trade, TradeFormData, AppSettings, InvestmentPrinciple, PrincipleCategory } from '../types';
import { generateId } from '../utils/calculations';
import { storage } from '../utils/storage';
import { t } from '../i18n';
import { ArrowLeft, Save, X, Lightbulb } from 'lucide-react';

interface TradeFormProps {
  settings: AppSettings;
  trades?: Trade[];
  onSave: (trade: Trade) => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ settings, trades = [], onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = settings;
  
  const isEditing = !!id;
  const existingTrade = isEditing ? trades.find(t => t.id === id) : null;
  
  const [formData, setFormData] = useState<TradeFormData>({
    asset: '',
    direction: 'long',
    entryPrice: 0,
    amount: 0,
    portfolioPercentage: 0,
    takeProfit: 0,
    stopLoss: 0,
    macroContext: [],
    thesis: '',
  });
  
  const [newKeyword, setNewKeyword] = useState('');
  const [availableKeywords] = useState(() => storage.getKeywords());
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractFormData, setExtractFormData] = useState({
    content: '',
    category: '',
  });
  const [categories] = useState(() => storage.getCategories(language));

  useEffect(() => {
    if (existingTrade) {
      setFormData({
        asset: existingTrade.asset,
        direction: existingTrade.direction,
        entryPrice: existingTrade.entryPrice,
        amount: existingTrade.amount,
        portfolioPercentage: existingTrade.portfolioPercentage || 0,
        takeProfit: existingTrade.takeProfit || 0,
        stopLoss: existingTrade.stopLoss || 0,
        macroContext: existingTrade.macroContext,
        thesis: existingTrade.thesis,
      });
    }
  }, [existingTrade]);

  const handleInputChange = (field: keyof TradeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.macroContext.includes(newKeyword.trim())) {
      const keyword = newKeyword.trim();
      setFormData(prev => ({
        ...prev,
        macroContext: [...prev.macroContext, keyword]
      }));
      setNewKeyword('');
      storage.addKeyword(keyword);
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      macroContext: prev.macroContext.filter(k => k !== keywordToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trade: Trade = {
      id: existingTrade?.id || generateId(),
      ...formData,
      status: existingTrade?.status || 'open',
      exitPrice: existingTrade?.exitPrice,
      postMortemNotes: existingTrade?.postMortemNotes,
      createdAt: existingTrade?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),

    };
    
    onSave(trade);
    navigate('/');
  };

  const handleExtractPrinciple = () => {
    // Pre-fill the principle content based on post-mortem notes
    const postMortemNotes = existingTrade?.postMortemNotes || '';
    if (postMortemNotes) {
      // Simple extraction logic - can be enhanced
      const extractedContent = postMortemNotes
        .replace(/我|这次|这次交易|这次亏损|这次盈利/g, '')
        .replace(/因为|由于|原因是/g, '')
        .replace(/违反了|违背了/g, '避免')
        .replace(/不应该|不该/g, '避免')
        .trim();
      
      setExtractFormData({
        content: extractedContent,
        category: '',
      });
    }
    setShowExtractModal(true);
  };

  const handleSaveExtractedPrinciple = () => {
    if (extractFormData.content.trim() && extractFormData.category) {
      const newPrinciple: InvestmentPrinciple = {
        id: generateId(),
        content: extractFormData.content.trim(),
        category: extractFormData.category,
        type: 'learned',
        sourceTradeId: existingTrade?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      storage.addPrinciple(newPrinciple, language);
      setShowExtractModal(false);
      setExtractFormData({ content: '', category: '' });
      
      // Show success message
      alert(t('principleSaved', language));
    }
  };

  const calculatePortfolioPercentage = () => {
    if (formData.amount && settings.totalPortfolio) {
      return (formData.amount / Number(settings.totalPortfolio)) * 100;
    }
    return 0;
  };

  const calculateAmount = () => {
    if (formData.portfolioPercentage && settings.totalPortfolio) {
      return (formData.portfolioPercentage / 100) * Number(settings.totalPortfolio);
    }
    return 0;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary p-2"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? t('edit', language) : t('newTrade', language)}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trade Background */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('tradeBackground', language)}
          </h2>
          
          {/* Macro Context */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('macroContext', language)}
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.macroContext.map((keyword, index) => (
                <span key={index} className="tag tag-primary flex items-center">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 hover:text-primary-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder={t('addKeyword', language)}
                className="input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="btn-primary"
              >
                {t('addKeyword', language)}
              </button>
            </div>
            {availableKeywords.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">
                  {language === 'zh' ? '常用关键词:' : 'Common keywords:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {availableKeywords.slice(0, 10).map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => {
                        if (!formData.macroContext.includes(keyword)) {
                          setFormData(prev => ({
                            ...prev,
                            macroContext: [...prev.macroContext, keyword]
                          }));
                        }
                      }}
                      className="text-xs text-primary-600 hover:text-primary-800 underline"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Thesis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('thesis', language)}
            </label>
            <textarea
              value={formData.thesis}
              onChange={(e) => handleInputChange('thesis', e.target.value)}
              placeholder={t('thesisPlaceholder', language)}
              className="input h-24 resize-none"
              required
            />
          </div>
        </div>

        {/* Trade Details */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('tradeDetails', language)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('asset', language)}
              </label>
              <input
                type="text"
                value={formData.asset}
                onChange={(e) => handleInputChange('asset', e.target.value)}
                placeholder={t('assetPlaceholder', language)}
                className="input"
                required
              />
            </div>

            {/* Direction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('direction', language)}
              </label>
              <select
                value={formData.direction}
                onChange={(e) => handleInputChange('direction', e.target.value)}
                className="input"
              >
                <option value="long">{t('long', language)}</option>
                <option value="short">{t('short', language)}</option>
              </select>
            </div>

            {/* Entry Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('entryPrice', language)}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.entryPrice}
                onChange={(e) => handleInputChange('entryPrice', Number(e.target.value))}
                className="input"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('amount', language)}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Trade Plan */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('tradePlan', language)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Take Profit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('takeProfit', language)}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.takeProfit}
                onChange={(e) => handleInputChange('takeProfit', Number(e.target.value))}
                className="input"
              />
            </div>

            {/* Stop Loss */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('stopLoss', language)}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.stopLoss}
                onChange={(e) => handleInputChange('stopLoss', Number(e.target.value))}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Trade Result - Only show for closed trades */}
        {existingTrade?.status === 'closed' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('tradeResult', language)}
            </h2>
            
            <div className="space-y-4">
              {/* Post-mortem Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postMortemNotes', language)}
                </label>
                <textarea
                  value={existingTrade.postMortemNotes || ''}
                  onChange={(e) => {
                    const updatedTrade = { ...existingTrade, postMortemNotes: e.target.value };
                    onSave(updatedTrade);
                  }}
                  placeholder={t('postMortemPlaceholder', language)}
                  className="input h-24 resize-none"
                />
              </div>
              
              {/* Extract as Principle Button */}
              {existingTrade.postMortemNotes && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleExtractPrinciple}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Lightbulb size={16} />
                    <span>{t('extractAsPrinciple', language)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            {t('cancel', language)}
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{t('save', language)}</span>
          </button>
        </div>
      </form>

      {/* Extract Principle Modal */}
      {showExtractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t('extractPrincipleTitle', language)}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('extractPrincipleDesc', language)}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('principleContent', language)}
                </label>
                <textarea
                  value={extractFormData.content}
                  onChange={(e) => setExtractFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={t('principleContentPlaceholder', language)}
                  className="input h-24 resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('category', language)}
                </label>
                <select
                  value={extractFormData.category}
                  onChange={(e) => setExtractFormData(prev => ({ ...prev, category: e.target.value }))}
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
                onClick={() => setShowExtractModal(false)}
                className="btn-secondary"
              >
                {t('cancel', language)}
              </button>
              <button
                onClick={handleSaveExtractedPrinciple}
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

export default TradeForm; 