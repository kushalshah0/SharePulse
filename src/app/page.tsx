'use client';

import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/Footer';
import LiveNepseData from '@/components/LiveNepseData';
import HomePageData from '@/components/HomePageData';
import Watchlist from '@/components/Watchlist';
import AllStocks from '@/components/AllStocks';
import { MarketDataProvider } from '@/context/MarketDataContext';

export default function Home() {
  return (
    <MarketDataProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar onSearchClick={() => {}} />
      
      <main className="flex-grow">
        {/* Moving Marquee - Stock Prices */}
        <div className="px-4 sm:px-6 lg:px-8 mb-3">
          <div className="relative overflow-hidden max-w-7xl mx-auto">
            <div className="py-2">
              <div className="flex animate-marquee-continuous whitespace-nowrap">
                {/* First set of stocks */}
                <div className="flex items-center space-x-4 px-4">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">NABIL</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">1,245.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+2.5%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">NICA</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">850.50</span>
                      <span className="text-red-600 dark:text-red-400 text-xs font-bold bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">-1.2%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">NMB</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">425.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+3.8%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">SCB</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">560.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+1.5%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">EBL</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">680.00</span>
                      <span className="text-red-600 dark:text-red-400 text-xs font-bold bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">-0.8%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">UPPER</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">320.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+4.2%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">NHPC</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">285.50</span>
                      <span className="text-red-600 dark:text-red-400 text-xs font-bold bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">-2.1%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">CHCL</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">510.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+1.9%</span>
                    </div>
                  </div>
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="flex items-center space-x-4 px-4">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">NABIL</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">1,245.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+2.5%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">NICA</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">850.50</span>
                      <span className="text-red-600 dark:text-red-400 text-xs font-bold bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">-1.2%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">NMB</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">425.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+3.8%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">SCB</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">560.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+1.5%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">EBL</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">680.00</span>
                      <span className="text-red-600 dark:text-red-400 text-xs font-bold bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">-0.8%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">UPPER</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">320.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+4.2%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">NHPC</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">285.50</span>
                      <span className="text-red-600 dark:text-red-400 text-xs font-bold bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">-2.1%</span>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2  shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-white font-bold text-sm">CHCL</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">510.00</span>
                      <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">+1.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Live NEPSE Data */}
          <div className="mb-8 md:mb-12">
            <LiveNepseData />
          </div>

          {/* Main Layout: Watchlist + All Stocks (Left) | Market Movers (Right) on Desktop */}
          <div className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column - Watchlist and All Stocks stacked (2 columns) */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Watchlist */}
                <div>
                  <Watchlist />
                </div>
                
                {/* All Stocks */}
                <div>
                  <AllStocks />
                </div>
              </div>

              {/* Right Column - Market Movers (1 column) */}
              <div className="lg:col-span-1">
                <HomePageData />
              </div>
            </div>
          </div>
        </div>
      </main>

        <SiteFooter />
      </div>
    </MarketDataProvider>
  );
}
