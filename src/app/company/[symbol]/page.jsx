'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/Footer';
import CompanyOverview from '@/components/company/CompanyOverview';
import CompanyMarketDepth from '@/components/company/CompanyMarketDepth';
import CompanyFloorsheet from '@/components/company/CompanyFloorsheet';
import CompanyPriceHistory from '@/components/company/CompanyPriceHistory';
import CompanyDividend from '@/components/company/CompanyDividend';
import CompanyRightShares from '@/components/company/CompanyRightShares';
import CompanyNews from '@/components/company/CompanyNews';
import CompanyAnnouncements from '@/components/company/CompanyAnnouncements';
import {
  Squares2X2Icon,
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ShareIcon,
  NewspaperIcon,
  MegaphoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Squares2X2Icon },
  { id: 'depth', label: 'Market Depth', icon: ChartBarIcon },
  { id: 'floorsheet', label: 'Floorsheet', icon: DocumentTextIcon },
  { id: 'history', label: 'Price History', icon: ClockIcon },
  { id: 'dividend', label: 'Dividend', icon: CurrencyDollarIcon },
  { id: 'right-shares', label: 'Right Shares', icon: ShareIcon },
  { id: 'news', label: 'News', icon: NewspaperIcon },
  { id: 'announcements', label: 'Announcements', icon: MegaphoneIcon },
];

export default function CompanyPage() {
  const params = useParams();
  const symbol = params?.symbol?.toUpperCase() || '';
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!symbol ? (
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Invalid Company Symbol
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Please provide a valid stock symbol.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
                  <span>/</span>
                  <span className="text-gray-900 dark:text-white font-medium">Company</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {symbol}
                </h1>
              </div>

              {/* Tabs */}
              <div className="mb-6 overflow-x-auto">
                <div className="flex gap-2 pb-2 min-w-max">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content - Only show based on active tab */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Main Overview - Full Width */}
                    <CompanyOverview symbol={symbol} />

                    {/* Market Depth & Floorsheet - Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <CompanyMarketDepth symbol={symbol} />
                      <CompanyFloorsheet symbol={symbol} />
                    </div>

                    {/* Price History - Full Width */}
                    <CompanyPriceHistory symbol={symbol} />

                    {/* Dividend, News, Announcements - Three Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <CompanyDividend symbol={symbol} compact />
                      <CompanyNews symbol={symbol} compact />
                      <CompanyAnnouncements symbol={symbol} compact />
                    </div>
                  </div>
                )}

                {activeTab === 'depth' && (
                  <CompanyMarketDepth symbol={symbol} />
                )}

                {activeTab === 'floorsheet' && (
                  <CompanyFloorsheet symbol={symbol} />
                )}

                {activeTab === 'history' && (
                  <CompanyPriceHistory symbol={symbol} />
                )}

                {activeTab === 'dividend' && (
                  <CompanyDividend symbol={symbol} />
                )}

                {activeTab === 'right-shares' && (
                  <CompanyRightShares symbol={symbol} />
                )}

                {activeTab === 'news' && (
                  <CompanyNews symbol={symbol} />
                )}

                {activeTab === 'announcements' && (
                  <CompanyAnnouncements symbol={symbol} />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
