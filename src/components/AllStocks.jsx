'use client';

import React, { useEffect, useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useMarketData } from '../context/MarketDataContext';

const AllStocks = () => {
  const { allStocks: stocks, allStocksLoading: loading, allStocksError: error } = useMarketData();
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'symbol', direction: 'asc' });
  const [sectors, setSectors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    filterAndSortStocks();
  }, [stocks, searchTerm, sectorFilter, sortConfig]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, sectorFilter]);

  // Extract unique sectors when stocks data changes
  useEffect(() => {
    if (stocks && stocks.length > 0) {
      const uniqueSectors = [...new Set(stocks.map(s => s.sector).filter(Boolean))];
      setSectors(['All', ...uniqueSectors.sort()]);
    }
  }, [stocks]);

  const filterAndSortStocks = () => {
    let filtered = [...stocks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.securityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sector filter
    if (sectorFilter !== 'All') {
      filtered = filtered.filter(stock => stock.sector === sectorFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    });

    setFilteredStocks(filtered);
  };

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 text-blue-600" />
      : <ChevronDownIcon className="h-4 w-4 text-blue-600" />;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStocks = filteredStocks.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Loading all stocks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200 text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div id="all-stocks" className="space-y-4 bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 md:p-6 shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/30">
          <svg className="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">All Stocks</h2>
          <p className="text-xs md:text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredStocks.length)} of {filteredStocks.length} stocks
          </p>
        </div>
      </div>

      {/* Filters - Compact Layout */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by symbol or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                title="Clear search"
              >
                <XMarkIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Sector Filter */}
          <div className="relative flex items-center md:w-auto">
            <FunnelIcon className="absolute left-3 h-4 w-4 text-gray-500 pointer-events-none" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full md:w-auto pl-9 pr-8 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent appearance-none cursor-pointer md:min-w-[140px]"
              title="Filter by sector"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b-2 border-green-200 dark:border-green-800/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => requestSort('symbol')} className="flex items-center space-x-1 text-xs font-semibold text-gray-400 uppercase hover:text-blue-600">
                    <span>Symbol</span>
                    <SortIcon columnKey="symbol" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => requestSort('lastTradedPrice')} className="flex items-center justify-end space-x-1 text-xs font-semibold text-gray-400 uppercase hover:text-blue-600 w-full">
                    <span>LTP</span>
                    <SortIcon columnKey="lastTradedPrice" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => requestSort('percentageChange')} className="flex items-center justify-end space-x-1 text-xs font-semibold text-gray-400 uppercase hover:text-blue-600 w-full">
                    <span>Change %</span>
                    <SortIcon columnKey="percentageChange" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => requestSort('change')} className="flex items-center justify-end space-x-1 text-xs font-semibold text-gray-400 uppercase hover:text-blue-600 w-full">
                    <span>Change</span>
                    <SortIcon columnKey="change" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => requestSort('highPrice')} className="flex items-center justify-end space-x-1 text-xs font-semibold text-gray-400 uppercase hover:text-blue-600 w-full">
                    <span>High</span>
                    <SortIcon columnKey="highPrice" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => requestSort('lowPrice')} className="flex items-center justify-end space-x-1 text-xs font-semibold text-gray-400 uppercase hover:text-blue-600 w-full">
                    <span>Low</span>
                    <SortIcon columnKey="lowPrice" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => requestSort('totalTradeQuantity')} className="flex items-center justify-end space-x-1 text-xs font-semibold text-gray-400 uppercase hover:text-blue-600 w-full">
                    <span>Volume</span>
                    <SortIcon columnKey="totalTradeQuantity" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => requestSort('totalTransactions')} className="flex items-center justify-end space-x-1 text-xs font-semibold text-gray-400 uppercase hover:text-blue-600 w-full">
                    <span>Trades</span>
                    <SortIcon columnKey="totalTransactions" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {currentStocks.map((stock, index) => {
                const isPositive = stock.change >= 0;
                const bgColor = isPositive 
                  ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' 
                  : 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30';
                return (
                  <tr key={index} className={`transition-colors ${bgColor}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {stock.iconUrl ? (
                          <img 
                            src={`https://cdn.arthakendra.com/${stock.iconUrl}`}
                            alt={stock.symbol}
                            className="w-8 h-8 rounded-lg object-contain border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-0.5"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=3B82F6&color=fff&size=64&bold=true&font-size=0.4`;
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
                            {stock.symbol.substring(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{stock.symbol}</p>
                          <p className="text-xs text-gray-400 truncate hidden md:block">{stock.securityName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-gray-900 dark:text-white inline-block">{stock.lastTradedPrice?.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <span>{isPositive ? '▲' : '▼'}</span>
                        <span>{isPositive ? '+' : ''}{stock.percentageChange?.toFixed(2)}%</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{stock.change?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white font-bold">
                      {stock.highPrice?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white font-bold">
                      {stock.lowPrice?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white font-bold">
                      {stock.totalTradeQuantity?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white font-bold">
                      {stock.totalTransactions?.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStocks.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                {currentPage > 2 && (
                  <>
                    <button
                      onClick={() => goToPage(1)}
                      className="w-8 h-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750 rounded"
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="text-gray-400">...</span>}
                  </>
                )}
                
                {currentPage > 1 && (
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    className="w-8 h-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750 rounded"
                  >
                    {currentPage - 1}
                  </button>
                )}
                
                <button className="w-8 h-8 text-sm font-medium text-white bg-blue-600 rounded">
                  {currentPage}
                </button>
                
                {currentPage < totalPages && (
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="w-8 h-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750 rounded"
                  >
                    {currentPage + 1}
                  </button>
                )}
                
                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && <span className="text-gray-400">...</span>}
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="w-8 h-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750 rounded"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="sm:hidden text-sm text-gray-400">
              Page {currentPage}/{totalPages}
            </div>
          </div>
        )}
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-12 text-gray-600 dark:text-gray-500">
          No stocks found matching your criteria
        </div>
      )}
    </div>
  );
};

export default AllStocks;
