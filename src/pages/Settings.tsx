import React, { useEffect, useState } from 'react';
import { AppSettings } from '../types';
import { t } from '../i18n';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { storage } from '../utils/storage';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const { language } = settings;
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
    totalPortfolio: settings.totalPortfolio === 0 ? '' : settings.totalPortfolio.toString(),
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData({
      ...settings,
      totalPortfolio: settings.totalPortfolio === 0 ? '' : settings.totalPortfolio.toString(),
    });
  }, [settings]);

  const handleInputChange = (field: keyof AppSettings, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let totalPortfolio = formData.totalPortfolio;
    if (typeof totalPortfolio === 'string') {
      totalPortfolio = totalPortfolio === '' || isNaN(Number(totalPortfolio)) ? 0 : Number(totalPortfolio);
    }
    onUpdate({ ...formData, totalPortfolio: Number(Number(totalPortfolio).toFixed(2)) });
    setSaved(true);
  };

  const handleExport = () => {
    const data = {
      trades: storage.getTrades(),
      settings: storage.getSettings(),
      keywords: storage.getKeywords(),
      principles_zh: storage.getPrinciples('zh'),
      principles_en: storage.getPrinciples('en'),
      categories_zh: storage.getCategories('zh'),
      categories_en: storage.getCategories('en'),
      diary: storage.getDiaryEntries(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketzen-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.trades) storage.saveTrades(data.trades);
        if (data.settings) storage.saveSettings(data.settings);
        if (data.keywords) storage.saveKeywords(data.keywords);
        if (data.principles_zh) storage.savePrinciples(data.principles_zh, 'zh');
        if (data.principles_en) storage.savePrinciples(data.principles_en, 'en');
        if (data.categories_zh) storage.saveCategories(data.categories_zh, 'zh');
        if (data.categories_en) storage.saveCategories(data.categories_en, 'en');
        if (data.diary) storage.saveDiaryEntries(data.diary);
        window.location.reload();
      } catch {
        window.alert(t('importFailed', language));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon size={22} className="text-clay-500" />
        <h1 className="page-title mb-0">
          {t('settings', language)}
        </h1>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="section-title mb-4">
          {t('dataBackup', language)}
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={handleExport}
          >
            {t('exportData', language)}
          </button>
          <label className="btn-secondary cursor-pointer">
            {t('importData', language)}
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
        <p className="text-xs text-ink-faint mt-3 leading-relaxed">
          {t('backupHint', language)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="section-title mb-4">
            {t('language', language)}
          </h2>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="language"
                value="zh"
                checked={formData.language === 'zh'}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="text-clay-600 focus:ring-clay-500"
              />
              <span className="text-sm font-medium text-ink">
                {t('chinese', language)}
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="language"
                value="en"
                checked={formData.language === 'en'}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="text-clay-600 focus:ring-clay-500"
              />
              <span className="text-sm font-medium text-ink">
                {t('english', language)}
              </span>
            </label>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="section-title mb-4">
            {t('totalPortfolio', language)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('totalPortfolio', language)}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.totalPortfolio}
                onChange={e => {
                  let value = e.target.value.replace(/[^\d.]/g, '');
                  const parts = value.split('.');
                  if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
                  if (parts[1]) value = parts[0] + '.' + parts[1].slice(0, 2);
                  handleInputChange('totalPortfolio', value);
                }}
                onBlur={e => {
                  const value = e.target.value;
                  if (value === '' || isNaN(Number(value))) {
                    handleInputChange('totalPortfolio', '');
                  } else {
                    handleInputChange('totalPortfolio', Number(value).toFixed(2));
                  }
                }}
                placeholder="0.00"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">
                {t('currency', language)}
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="input"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CNY">CNY</option>
                <option value="JPY">JPY</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          {saved && (
            <span className="text-sm text-sage-600">{t('settingsSaved', language)}</span>
          )}
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{t('save', language)}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
