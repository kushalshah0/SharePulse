'use client';

import { useEffect, useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';

const CompanyDividend = ({ symbol, compact = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.getCompanyDividend(symbol, pageSize, currentPage);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, currentPage]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatPercent = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || !data.content || data.content.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <CurrencyDollarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dividend History</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">No dividend data available</p>
        </div>
      </div>
    );
  }

  const dividendData = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dividend History</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Fiscal Year</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-400">Bonus (%)</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-400">Cash (%)</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-400">Total (%)</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Book Closure</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Announcement Date</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Agm Date</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Listing Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {dividendData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-white">
                  {item.fiscalYear || '-'}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">
                  {formatPercent(item.bonus)}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">
                  {formatPercent(item.cash)}
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-green-600 dark:text-green-400">
                  {formatPercent(item.total)}
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {formatDate(item.bookClosureDate)}
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {formatDate(item.announcementDate)}
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {formatDate(item.agmDate)}
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {formatDate(item.listingDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyDividend;