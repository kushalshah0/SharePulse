'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import api from '@/services/api';

const CompanyMarketDepth = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchData();
  }, [symbol]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('en-NP').format(num);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Depth</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No market depth data available</p>
        </div>
      </div>
    );
  }

  const { buyOrders = [], sellOrders = [] } = data;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Depth</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpIcon className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">Buy Orders</span>
          </div>
          <div className="space-y-2">
            {buyOrders.length > 0 ? (
              buyOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800/30">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Rs. {order.price?.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{formatNumber(order.quantity)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No buy orders</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownIcon className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-600 dark:text-red-400">Sell Orders</span>
          </div>
          <div className="space-y-2">
            {sellOrders.length > 0 ? (
              sellOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-100 dark:border-red-800/30">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Rs. {order.price?.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{formatNumber(order.quantity)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No sell orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyMarketDepth;
