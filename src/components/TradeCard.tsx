import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trade, AppSettings } from '../types';
import { formatCurrency, formatPercentage, calculatePnl, calculatePnlPercentage, toNumber } from '../utils/calculations';
import { t } from '../i18n';
import { Edit, Trash2, Check, ArrowUp, ArrowDown } from 'lucide-react';

interface TradeCardProps {
  trade: Trade;
  settings: AppSettings;
  onUpdate: (id: string, updates: Partial<Trade>) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  settings,
  onUpdate,
  onDelete,
  readOnly = false,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [exitPrice, setExitPrice] = useState(String(trade.entryPrice ?? ''));
  const [closeNotes, setCloseNotes] = useState('');
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
    const price = toNumber(exitPrice);
    if (!price || price <= 0) return;
    onUpdate(trade.id, {
      status: 'closed',
      exitPrice: price,
      postMortemNotes: closeNotes.trim(),
    });
    setShowCloseForm(false);
  };

  const handleDelete = () => {
    onDelete(trade.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-lg font-serif text-ink">{trade.asset}</span>
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
            {trade.instrumentType && (
              <span className="tag tag-gray">
                {trade.instrumentType === '现货' || trade.instrumentType === 'spot'
                  ? t('instrumentTypeSpot', language)
                  : t('instrumentTypeFutures', language)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {trade.tradeDate && (
              <div>
                <p className="text-sm text-ink-muted mb-1">{t('tradeDate', language)}</p>
                <p className="font-medium">{trade.tradeDate}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-ink-muted mb-1">{t('entryPrice', language)}</p>
              <p className="font-medium">{formatCurrency(trade.entryPrice, settings.currency)}</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted mb-1">{t('amount', language)}</p>
              <p className="font-medium">{formatCurrency(trade.amount, settings.currency)}</p>
            </div>
            {trade.vixIndex != null && (
              <div>
                <p className="text-sm text-ink-muted mb-1">{t('vixIndex', language)}</p>
                <p className="font-medium">{trade.vixIndex}</p>
              </div>
            )}
            {trade.exitPrice != null && trade.exitPrice !== undefined && (
              <>
                <div>
                  <p className="text-sm text-ink-muted mb-1">{t('exitPrice', language)}</p>
                  <p className="font-medium">{formatCurrency(trade.exitPrice, settings.currency)}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted mb-1">{t('finalPnl', language)}</p>
                  <p className={`font-medium ${isProfit ? 'text-sage-600' : isLoss ? 'text-rose-600' : 'text-ink'}`}>
                    {formatCurrency(currentPnl, settings.currency)} ({formatPercentage(currentPnlPercentage)})
                  </p>
                </div>
              </>
            )}
          </div>

          {trade.macroContext.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-ink-muted mb-2">{t('macroContext', language)}</p>
              <div className="flex flex-wrap gap-2">
                {trade.macroContext.map((keyword) => (
                  <span key={keyword} className="tag tag-primary text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {trade.thesis && (
            <div className="mb-4">
              <p className="text-sm text-ink-muted mb-2">{t('thesis', language)}</p>
              <p className="text-sm text-ink leading-relaxed">{trade.thesis}</p>
            </div>
          )}

          {trade.postMortemNotes && (
            <div>
              <p className="text-sm text-ink-muted mb-2">{t('postMortemNotes', language)}</p>
              <p className="text-sm text-ink leading-relaxed">{trade.postMortemNotes}</p>
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center space-x-1.5 shrink-0">
            {trade.status === 'open' && (
              <button
                type="button"
                onClick={() => setShowCloseForm(prev => !prev)}
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
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger p-2"
              title={t('delete', language)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {showCloseForm && !readOnly && (
        <div className="mt-4 p-4 bg-paper-200 rounded-[12px] border border-paper-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm text-ink-muted mb-1">{t('exitPricePrompt', language)}</label>
              <input
                type="text"
                inputMode="decimal"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value.replace(/[^\d.]/g, ''))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-ink-muted mb-1">{t('postMortemNotes', language)}</label>
              <input
                type="text"
                value={closeNotes}
                onChange={(e) => setCloseNotes(e.target.value)}
                placeholder={t('postMortemPlaceholder', language)}
                className="input"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleCloseTrade} className="btn-success text-sm px-3 py-1.5">
              {t('confirm', language)}
            </button>
            <button type="button" onClick={() => setShowCloseForm(false)} className="btn-secondary text-sm px-3 py-1.5">
              {t('cancel', language)}
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && !readOnly && (
        <div className="mt-4 p-4 bg-rose-50 rounded-[12px] border border-rose-100">
          <p className="text-sm text-rose-600 mb-3">
            {t('confirmDelete', language)}
          </p>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleDelete}
              className="btn-danger text-sm px-3 py-1"
            >
              {t('delete', language)}
            </button>
            <button
              type="button"
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
