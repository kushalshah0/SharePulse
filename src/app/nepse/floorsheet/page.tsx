'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/Footer';
import { MarketDataProvider } from '@/context/MarketDataContext';
import { ChartBarIcon, CubeIcon, BanknotesIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FloorsheetItem {
  symbol: string;
  name: string;
  buyerMemberId: string;
  sellerMemberId: string;
  contractId: number;
  contractQuantity: number;
  contractRate: number;
  contractAmount: number;
  businessDate: string;
  iconUrl?: string;
}

interface FloorsheetData {
  success: boolean;
  data: {
    totalAmount: number;
    totalQty: number;
    totalTrades: number;
    pageIndex: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    content: FloorsheetItem[];
  };
}

export default function FloorsheetPage() {
  const [floorsheetData, setFloorsheetData] = useState<FloorsheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('');

  const fetchFloorsheet = async (page: number, size: number, symbol?: string) => {
    try {
      setLoading(true);
      setError(null);
      let url = `/api/nepse/floorsheet?size=${size}&page=${page}`;
      if (symbol) {
        url += `&symbol=${encodeURIComponent(symbol)}`;
      }
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch floorsheet data');
      }
      
      const data = await response.json();
      setFloorsheetData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching floorsheet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloorsheet(pageIndex, pageSize, symbolFilter);
  }, [pageIndex, pageSize, symbolFilter]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NP').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handlePrevPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (floorsheetData && pageIndex < floorsheetData.data.totalPages) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handleSearch = () => {
    setSymbolFilter(searchQuery.trim().toUpperCase());
    setPageIndex(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSymbolFilter('');
    setPageIndex(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <MarketDataProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Floorsheet
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time trade transactions on NEPSE
              </p>
            </div>

            {/* Summary Cards */}
            {floorsheetData && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">Total Trades</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatNumber(floorsheetData.data.totalTrades)}
                      </p>
                    </div>
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                      <ChartBarIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">Total Quantity</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatNumber(floorsheetData.data.totalQty)}
                      </p>
                    </div>
                    <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm">
                      <CubeIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Rs. {formatCurrency(floorsheetData.data.totalAmount)}
                      </p>
                    </div>
                    <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm">
                      <BanknotesIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by stock symbol (e.g., NABIL, BANDIPUR)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold shadow-sm hover:shadow-md"
                >
                  Search
                </button>
                {symbolFilter && (
                  <button
                    onClick={handleClearSearch}
                    className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold shadow-sm hover:shadow-md"
                  >
                    Clear
                  </button>
                )}
              </div>
              {symbolFilter && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Showing trades for <span className="font-semibold text-blue-600 dark:text-blue-400">{symbolFilter}</span>
                  {floorsheetData && ` - ${floorsheetData.data.totalItems.toLocaleString()} total trades found`}
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading floorsheet data...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center shadow-sm">
                <p className="text-red-600 dark:text-red-400 font-medium mb-3">{error}</p>
                <button
                  onClick={() => fetchFloorsheet(pageIndex, pageSize)}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-sm hover:shadow-md"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Floorsheet Table */}
            {floorsheetData && !loading && !error && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Contract ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Symbol
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Buyer
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Seller
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Rate
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {floorsheetData.data.content.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                              {symbolFilter ? `No trades found for symbol "${symbolFilter}".` : 'No data available.'}
                            </td>
                          </tr>
                        ) : (
                          floorsheetData.data.content.map((item) => (
                          <tr key={item.contractId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {item.contractId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {item.symbol}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                    {item.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {item.buyerMemberId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {item.sellerMemberId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                              {formatNumber(item.contractQuantity)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                              Rs. {formatCurrency(item.contractRate)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                              Rs. {formatCurrency(item.contractAmount)}
                            </td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                    Page {pageIndex.toLocaleString()} of {floorsheetData.data.totalPages.toLocaleString()}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevPage}
                      disabled={pageIndex === 1}
                      className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm hover:shadow-md"
                    >
                      Previous
                    </button>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={pageIndex >= floorsheetData.data.totalPages}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm hover:shadow-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <SiteFooter />
      </div>
    </MarketDataProvider>
  );
}
