'use client';

import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';

const CompanyFloorsheet = ({ symbol, compact = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = compact ? 10 : 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const response = await api.getCompanyFloorsheet(symbol, pageSize, page);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, page, pageSize]);

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

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (data && page < data.totalPages) setPage(page + 1);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const floorsheetData = data?.content || [];

  if (error || !data || floorsheetData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Floorsheet</h3>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">No floorsheet data available</p>
        </div>
      </div>
    );
  }

  const totalPages = data.totalPages || 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Floorsheet</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Page {page} of {totalPages}
        </span>
      </div>
      
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-left text-xs text-gray-500 dark:text-gray-400 uppercase">
              <th className="pb-2 font-medium">Buyer</th>
              <th className="pb-2 font-medium">Seller</th>
              <th className="pb-2 font-medium text-right">Qty</th>
              <th className="pb-2 font-medium text-right">Rate</th>
              <th className="pb-2 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {floorsheetData.map((item) => (
              <tr key={item.contractId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {item.buyerMemberId}
                </td>
                <td className="py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {item.sellerMemberId}
                </td>
                <td className="py-3 text-sm text-gray-900 dark:text-gray-100 text-right whitespace-nowrap">
                  {formatNumber(item.contractQuantity)}
                </td>
                <td className="py-3 text-sm text-gray-900 dark:text-gray-100 text-right whitespace-nowrap">
                  Rs. {formatCurrency(item.contractRate)}
                </td>
                <td className="py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right whitespace-nowrap">
                  Rs. {formatCurrency(item.contractAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyFloorsheet;
