import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trade, TradeFormData, AppSettings, InvestmentPrinciple } from '../types';
import { generateId, parseLocalDate, toLocalDateString, toNumber } from '../utils/calculations';
import { storage } from '../utils/storage';
import { t } from '../i18n';
import { ArrowLeft, Save, X, Lightbulb } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const existingTrade = isEditing ? trades.find(trade => trade.id === id) : undefined;

  const [formData, setFormData] = useState<TradeFormData>({
    tradeDate: '',
    vixIndex: 0,
    instrumentType: language === 'zh' ? '现货' : 'spot',
    asset: '',
    direction: 'long',
    entryPrice: '',
    amount: '',
    portfolioPercentage: '',
    takeProfit: '',
    stopLoss: '',
    macroContext: [],
    thesis: '',
  });

  const [postMortemNotes, setPostMortemNotes] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [availableKeywords] = useState(() => storage.getKeywords());
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractFormData, setExtractFormData] = useState({
    content: '',
    category: '',
  });
  const [categories] = useState(() => storage.getCategories(language));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing) return;
    if (!existingTrade) {
      if (trades.length > 0) setHydrated(true);
      return;
    }
    setFormData({
      tradeDate: existingTrade.tradeDate || '',
      vixIndex: existingTrade.vixIndex ?? 0,
      instrumentType: existingTrade.instrumentType || (language === 'zh' ? '现货' : 'spot'),
      asset: existingTrade.asset,
      direction: existingTrade.direction,
      entryPrice: existingTrade.entryPrice,
      amount: existingTrade.amount,
      portfolioPercentage: existingTrade.portfolioPercentage || '',
      takeProfit: existingTrade.takeProfit || '',
      stopLoss: existingTrade.stopLoss || '',
      macroContext: existingTrade.macroContext,
      thesis: existingTrade.thesis,
    });
    setPostMortemNotes(existingTrade.postMortemNotes || '');
    setHydrated(true);
  }, [existingTrade, language, isEditing, trades.length]);

  const handleInputChange = (field: keyof TradeFormData, value: TradeFormData[keyof TradeFormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.macroContext.includes(newKeyword.trim())) {
      const keyword = newKeyword.trim();
      setFormData(prev => ({
        ...prev,
        macroContext: [...prev.macroContext, keyword],
      }));
      setNewKeyword('');
      storage.addKeyword(keyword);
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      macroContext: prev.macroContext.filter(k => k !== keywordToRemove),
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.tradeDate) {
      errors.tradeDate = t('tradeDateRequired', language);
    }
    if (
      formData.vixIndex === undefined ||
      formData.vixIndex === null ||
      isNaN(Number(formData.vixIndex)) ||
      Number(formData.vixIndex) < 0 ||
      Number(formData.vixIndex) > 100
    ) {
      errors.vixIndex = t('vixIndexInvalid', language);
    }
    if (!formData.instrumentType) {
      errors.instrumentType = t('instrumentTypeRequired', language);
    }
    if (!formData.asset.trim()) {
      errors.asset = t('required', language);
    }
    const entryPrice = toNumber(formData.entryPrice);
    const amount = toNumber(formData.amount);
    if (!(entryPrice > 0)) errors.entryPrice = t('invalidPrice', language);
    if (!(amount > 0)) errors.amount = t('invalidAmount', language);
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const trade: Trade = {
      id: existingTrade?.id || generateId(),
      asset: formData.asset.trim(),
      direction: formData.direction,
      entryPrice: toNumber(formData.entryPrice),
      amount: toNumber(formData.amount),
      portfolioPercentage: formData.portfolioPercentage === '' ? undefined : toNumber(formData.portfolioPercentage),
      takeProfit: formData.takeProfit === '' ? undefined : toNumber(formData.takeProfit),
      stopLoss: formData.stopLoss === '' ? undefined : toNumber(formData.stopLoss),
      macroContext: formData.macroContext,
      thesis: formData.thesis,
      tradeDate: formData.tradeDate,
      vixIndex: Number(Number(formData.vixIndex).toFixed(2)),
      instrumentType: formData.instrumentType === '' ? (language === 'zh' ? '现货' : 'spot') : formData.instrumentType,
      status: existingTrade?.status || 'open',
      exitPrice: existingTrade?.exitPrice,
      postMortemNotes: postMortemNotes || existingTrade?.postMortemNotes,
      createdAt: existingTrade?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(trade);
    navigate('/dashboard');
  };

  const handleExtractPrinciple = () => {
    const notes = postMortemNotes || existingTrade?.postMortemNotes || '';
    if (notes) {
      const extractedContent = notes
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
      window.alert(t('principleSaved', language));
    }
  };

  const sanitizeDecimal = (raw: string) => {
    let v = raw.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
    if (v.includes('.')) v = v.replace(/(\.\d{0,2}).*$/, '$1');
    return v;
  };

  if (isEditing && hydrated && trades.length > 0 && !existingTrade) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 card">
        <p className="font-serif text-xl text-ink mb-3">{t('tradeNotFound', language)}</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/dashboard')}>
          {t('backToDashboard', language)}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary p-2"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="page-title mb-0">
            {isEditing ? t('edit', language) : t('newTrade', language)}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="section-title mb-4">
            {t('tradeBackground', language)}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ink-muted mb-2">
              {t('macroContext', language)}
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.macroContext.map((keyword) => (
                <span key={keyword} className="tag tag-primary flex items-center">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 hover:text-clay-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder={t('addKeyword', language)}
                className="input flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
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
                <p className="text-xs text-ink-faint mb-1">
                  {t('commonKeywords', language)}:
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
                            macroContext: [...prev.macroContext, keyword],
                          }));
                        }
                      }}
                      className="text-xs text-clay-600 hover:text-clay-700 underline"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">
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

        <div className="card p-6">
          <h2 className="section-title mb-4">
            {t('tradeDetails', language)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('tradeDate', language)}
              </label>
              <DatePicker
                selected={parseLocalDate(formData.tradeDate)}
                onChange={date => handleInputChange('tradeDate', date ? toLocalDateString(date) : '')}
                dateFormat="yyyy-MM-dd"
                placeholderText={t('tradeDatePlaceholder', language)}
                className="input w-full"
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
                isClearable
                required
              />
              {formErrors.tradeDate && (
                <div className="text-rose-600 text-xs mt-1">{formErrors.tradeDate}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('vixIndex', language)}
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={100}
                value={formData.vixIndex}
                onChange={e => handleInputChange('vixIndex', Number(Number(e.target.value).toFixed(2)))}
                className="input"
                required
                placeholder={t('vixIndexPlaceholder', language)}
              />
              {formErrors.vixIndex && (
                <div className="text-rose-600 text-xs mt-1">{formErrors.vixIndex}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
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
              {formErrors.asset && (
                <div className="text-rose-600 text-xs mt-1">{formErrors.asset}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('instrumentType', language)}
              </label>
              <select
                value={formData.instrumentType}
                onChange={e => handleInputChange('instrumentType', e.target.value as TradeFormData['instrumentType'])}
                className="input"
                required
              >
                <option value="">{t('instrumentTypePlaceholder', language)}</option>
                <option value={language === 'zh' ? '现货' : 'spot'}>{t('instrumentTypeSpot', language)}</option>
                <option value={language === 'zh' ? '合约' : 'futures'}>{t('instrumentTypeFutures', language)}</option>
              </select>
              {formErrors.instrumentType && (
                <div className="text-rose-600 text-xs mt-1">{formErrors.instrumentType}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('direction', language)}
              </label>
              <select
                value={formData.direction}
                onChange={(e) => handleInputChange('direction', e.target.value as 'long' | 'short')}
                className="input"
              >
                <option value="long">{t('long', language)}</option>
                <option value="short">{t('short', language)}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('entryPrice', language)}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.entryPrice}
                onChange={e => handleInputChange('entryPrice', sanitizeDecimal(e.target.value))}
                onBlur={e => {
                  const v = e.target.value;
                  handleInputChange('entryPrice', v === '' ? '' : Number(v).toFixed(2));
                }}
                className="input"
                required
              />
              {formErrors.entryPrice && (
                <div className="text-rose-600 text-xs mt-1">{formErrors.entryPrice}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('amount', language)}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.amount}
                onChange={e => {
                  const v = sanitizeDecimal(e.target.value);
                  handleInputChange('amount', v);
                  const total = Number(settings.totalPortfolio) || 0;
                  const amount = toNumber(v);
                  if (total > 0 && amount > 0) {
                    handleInputChange('portfolioPercentage', ((amount / total) * 100).toFixed(2));
                  }
                }}
                onBlur={e => {
                  const v = e.target.value;
                  handleInputChange('amount', v === '' ? '' : Number(v).toFixed(2));
                }}
                className="input"
                required
              />
              {formErrors.amount && (
                <div className="text-rose-600 text-xs mt-1">{formErrors.amount}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('portfolioPercentage', language)}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.portfolioPercentage}
                onChange={e => {
                  const v = sanitizeDecimal(e.target.value);
                  handleInputChange('portfolioPercentage', v);
                  const total = Number(settings.totalPortfolio) || 0;
                  const pct = toNumber(v);
                  if (total > 0 && pct > 0) {
                    handleInputChange('amount', ((pct / 100) * total).toFixed(2));
                  }
                }}
                onBlur={e => {
                  const v = e.target.value;
                  handleInputChange('portfolioPercentage', v === '' ? '' : Number(v).toFixed(2));
                }}
                className="input"
                placeholder="%"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="section-title mb-4">
            {t('tradePlan', language)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('takeProfit', language)}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.takeProfit}
                onChange={e => handleInputChange('takeProfit', sanitizeDecimal(e.target.value))}
                onBlur={e => {
                  const v = e.target.value;
                  handleInputChange('takeProfit', v === '' ? '' : Number(v).toFixed(2));
                }}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('stopLoss', language)}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.stopLoss}
                onChange={e => handleInputChange('stopLoss', sanitizeDecimal(e.target.value))}
                onBlur={e => {
                  const v = e.target.value;
                  handleInputChange('stopLoss', v === '' ? '' : Number(v).toFixed(2));
                }}
                className="input"
              />
            </div>
          </div>
        </div>

        {existingTrade?.status === 'closed' && (
          <div className="card p-6">
            <h2 className="section-title mb-4">
              {t('tradeResult', language)}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">
                  {t('postMortemNotes', language)}
                </label>
                <textarea
                  value={postMortemNotes}
                  onChange={(e) => setPostMortemNotes(e.target.value)}
                  placeholder={t('postMortemPlaceholder', language)}
                  className="input h-24 resize-none"
                />
              </div>

              {postMortemNotes && (
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

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
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

      {showExtractModal && (
        <div className="fixed inset-0 bg-ink/35 flex items-center justify-center p-4 z-50">
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-serif text-lg text-ink mb-2">
              {t('extractPrincipleTitle', language)}
            </h2>
            <p className="text-sm text-ink-muted mb-4">
              {t('extractPrincipleDesc', language)}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">
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
                <label className="block text-sm font-medium text-ink-muted mb-2">
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
                type="button"
                onClick={() => setShowExtractModal(false)}
                className="btn-secondary"
              >
                {t('cancel', language)}
              </button>
              <button
                type="button"
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
