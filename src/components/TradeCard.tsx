import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trade, AppSettings } from '../types';
import { formatCurrency, formatPercentage, calculatePnl, calculatePnlPercentage } from '../utils/calculations';
import { t } from '../i18n';
import { Edit, Trash2, X, Check, ArrowUp, ArrowDown } from 'lucide-react';

interface TradeCardProps {
  trade: Trade;
  settings: AppSettings;
  onUpdate: (id: string, updates: Partial<Trade>) => void;
  onDelete: (id: string) => void;
}

const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  settings,
  onUpdate,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { language } = settings;

  const currentPnl = trade.exitPrice 
    ? calculatePnl(trade.entryPrice, trade.exitPrice, trade.direction)
    : 0;
  
  const currentPnlPercentage = trade.exitPrice
    ? calculatePnlPercentage(trade.entryPrice, trade.exitPrice, trade.direction)
    : 0;

  const isProfit = currentPnl > 0;
  const isLoss = currentPnl < 0;

  const handleCloseTrade = () => {
    const exitPrice = prompt(
      language === 'zh' ? '请输入平仓价格:' : 'Enter exit price:',
      trade.entryPrice.toString()
    );
    
    if (exitPrice && !isNaN(Number(exitPrice))) {
      const postMortemNotes = prompt(
        language === 'zh' ? '复盘总结 (可选):' : 'Post-mortem notes (optional):'
      ) || '';
      
      onUpdate(trade.id, {
        status: 'closed',
        exitPrice: Number(exitPrice),
        postMortemNotes,

      });
    }
  };

  const handleDelete = () => {
    if (confirm(t('confirmDelete', language))) {
      onDelete(trade.id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">{trade.asset}</span>
              <span className={`tag ${trade.direction === 'long' ? 'tag-success' : 'tag-danger'}`}>
                {trade.direction === 'long' ? (
                  <ArrowUp size={12} className="mr-1" />
                ) : (
                  <ArrowDown size={12} className="mr-1" />
                )}
                {t(trade.direction, language)}
              </span>
              <span className={`tag ${trade.status === 'open' ? 'tag-primary' : 'tag-gray'}`}>
                {t(trade.status, language)}
              </span>
            </div>
          </div>

          {/* Trade Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('entryPrice', language)}</p>
              <p className="font-medium">{formatCurrency(trade.entryPrice, settings.currency)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('amount', language)}</p>
              <p className="font-medium">{formatCurrency(trade.amount, settings.currency)}</p>
            </div>
            {trade.exitPrice && (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('exitPrice', language)}</p>
                  <p className="font-medium">{formatCurrency(trade.exitPrice, settings.currency)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('finalPnl', language)}</p>
                  <p className={`font-medium ${isProfit ? 'text-success-600' : isLoss ? 'text-danger-600' : 'text-gray-900'}`}>
                    {formatCurrency(currentPnl, settings.currency)} ({formatPercentage(currentPnlPercentage)})
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Macro Context */}
          {trade.macroContext.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{t('macroContext', language)}</p>
              <div className="flex flex-wrap gap-2">
                {trade.macroContext.map((keyword, index) => (
                  <span key={index} className="tag tag-primary text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Thesis */}
          {trade.thesis && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{t('thesis', language)}</p>
              <p className="text-sm text-gray-700">{trade.thesis}</p>
            </div>
          )}

          {/* Post-mortem Notes */}
          {trade.postMortemNotes && (
            <div>
              <p className="text-sm text-gray-600 mb-2">{t('postMortemNotes', language)}</p>
              <p className="text-sm text-gray-700">{trade.postMortemNotes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {trade.status === 'open' && (
            <button
              onClick={handleCloseTrade}
              className="btn-success p-2"
              title={t('close', language)}
            >
              <Check size={16} />
            </button>
          )}
          
          <Link
            to={`/edit/${trade.id}`}
            className="btn-secondary p-2"
            title={t('edit', language)}
          >
            <Edit size={16} />
          </Link>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger p-2"
            title={t('delete', language)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-danger-50 rounded-lg border border-danger-200">
          <p className="text-sm text-danger-800 mb-3">
            {t('confirmDelete', language)}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="btn-danger text-sm px-3 py-1"
            >
              {t('delete', language)}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn-secondary text-sm px-3 py-1"
            >
              {t('cancel', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeCard; 