'use client';

import { useEffect, useState } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';

const CompanyRightShares = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.getCompanyRightShares(symbol, 10);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !data || !data.content || data.content.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <ShareIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Right Shares</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">No right shares data available</p>
        </div>
      </div>
    );
  }

  const rightSharesData = data?.content || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <ShareIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Right Shares</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Issue Date</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-400">Units</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-400">Price</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-400">Total Amount</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Ratio</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Opening</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Closing</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Book Closure</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Issue Manager</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rightSharesData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {formatDate(item.openingDate)}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">
                  {formatNumber(item.units)}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">
                  Rs. {formatNumber(item.price)}
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-gray-900 dark:text-white">
                  Rs. {formatNumber(item.totalAmount)}
                </td>
                <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                  {item.rightShareRatio || '-'}
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {formatDate(item.openingDate)}
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {formatDate(item.closingDate)}
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {formatDate(item.bookClosureDate)}
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                  {item.issueManager || '-'}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    item.status === 'Closed' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {item.status || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyRightShares;