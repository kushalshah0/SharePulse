'use client';

import { useEffect, useState } from 'react';
import { CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';

const CompanyDividend = ({ symbol, compact = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getCompanyDividend(symbol, compact ? 3 : 50);
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, compact]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('en-NP').format(num);
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${compact ? 'h-full' : ''}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || !data.data || !data.data.content || data.data.content.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${compact ? 'h-full' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <CurrencyDollarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dividend</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">No data</p>
        </div>
      </div>
    );
  }

  const dividendData = data?.data?.content || [];
  const displayData = compact ? dividendData.slice(0, 3) : dividendData.slice(0, 10);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${compact ? 'h-full' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <CurrencyDollarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dividend</h3>
      </div>
      
      <div className={`space-y-2 ${compact ? 'max-h-[200px] overflow-y-auto' : ''}`}>
        {displayData.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 border border-green-100 dark:border-green-800/30">
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Rs. {formatCurrency(item.cash || 0)} {item.bonus ? `+ ${item.bonus}%` : ''}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {item.fiscalYear}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDividend;
