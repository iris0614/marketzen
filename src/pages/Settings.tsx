import React, { useState } from 'react';
import { AppSettings } from '../types';
import { t } from '../i18n';
import { Settings as SettingsIcon, Save } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const { language } = settings;
  const [formData, setFormData] = useState<AppSettings>(settings);

  const handleInputChange = (field: keyof AppSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon size={24} className="text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-900">
          {t('settings', language)}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Settings */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
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
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {t('english', language)}
              </span>
            </label>
          </div>
        </div>

        {/* Portfolio Settings */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('totalPortfolio', language)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('totalPortfolio', language)}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalPortfolio}
                onChange={(e) => handleInputChange('totalPortfolio', Number(e.target.value))}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Submit */}
        <div className="flex justify-end">
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