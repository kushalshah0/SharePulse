'use client';

import { useEffect, useState } from 'react';
import { ArrowPathIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import api from '@/services/api';

const CompanyMarketDepth = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getCompanyMarketDepth(symbol);
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('en-NP').format(num);
  };

  if (loading && !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Market Depth</h3>
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const { buyOrders = [], sellOrders = [] } = data;
  
  const totalBuyQty = buyOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);
  const totalSellQty = sellOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);
  const totalQty = totalBuyQty + totalSellQty;
  const buyPercent = totalQty > 0 ? ((totalBuyQty / totalQty) * 100).toFixed(1) : 0;
  const sellPercent = totalQty > 0 ? ((totalSellQty / totalQty) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Market Depth</h3>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-green-600 dark:text-green-400 font-medium">Buy: {formatNumber(totalBuyQty)} ({buyPercent}%)</span>
          <span className="text-red-600 dark:text-red-400 font-medium">Sell: {formatNumber(totalSellQty)} ({sellPercent}%)</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-500" 
            style={{ width: `${buyPercent}%` }}
          />
          <div 
            className="bg-gradient-to-r from-red-500 to-red-400" 
            style={{ width: `${100 - buyPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Top 5 Buy</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-xs">
              <thead className="bg-green-50 dark:bg-green-900/20">
                <tr>
                  <th className="px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400">Orders</th>
                  <th className="px-2 py-1.5 text-right font-medium text-gray-600 dark:text-gray-400">Quantity</th>
                  <th className="px-2 py-1.5 text-right font-medium text-gray-600 dark:text-gray-400">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {buyOrders.slice(0, 5).map((order, index) => (
                  <tr key={index} className="bg-white dark:bg-gray-800">
                    <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400">{order.orderCount || 1}</td>
                    <td className="px-2 py-1.5 text-right text-gray-900 dark:text-white">{formatNumber(order.quantity)}</td>
                    <td className="px-2 py-1.5 text-right font-medium text-gray-900 dark:text-white">{order.price?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-green-50 dark:bg-green-900/20">
                <tr>
                  <td className="px-2 py-1.5 font-medium text-green-700 dark:text-green-400">Total Buy Qty</td>
                  <td className="px-2 py-1.5 text-right font-semibold text-green-700 dark:text-green-400">{formatNumber(totalBuyQty)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Top 5 Sell</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-xs">
              <thead className="bg-red-50 dark:bg-red-900/20">
                <tr>
                  <th className="px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400">Orders</th>
                  <th className="px-2 py-1.5 text-right font-medium text-gray-600 dark:text-gray-400">Quantity</th>
                  <th className="px-2 py-1.5 text-right font-medium text-gray-600 dark:text-gray-400">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {sellOrders.slice(0, 5).map((order, index) => (
                  <tr key={index} className="bg-white dark:bg-gray-800">
                    <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400">{order.orderCount || 1}</td>
                    <td className="px-2 py-1.5 text-right text-gray-900 dark:text-white">{formatNumber(order.quantity)}</td>
                    <td className="px-2 py-1.5 text-right font-medium text-gray-900 dark:text-white">{order.price?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-red-50 dark:bg-red-900/20">
                <tr>
                  <td className="px-2 py-1.5 font-medium text-red-700 dark:text-red-400">Total Sell Qty</td>
                  <td className="px-2 py-1.5 text-right font-semibold text-red-700 dark:text-red-400">{formatNumber(totalSellQty)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyMarketDepth;
