'use client';

import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/Footer';
import LiveNepseData from '@/components/LiveNepseData';
import HomePageData from '@/components/HomePageData';
import Watchlist from '@/components/Watchlist';
import AllStocks from '@/components/AllStocks';
import MarketPhaseIndicator from '@/components/MarketPhaseIndicator';
import StockMarquee from '@/components/StockMarquee';
import { MarketDataProvider } from '@/context/MarketDataContext';

export default function Home() {
  return (
    <MarketDataProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar onSearchClick={() => {}} />
      
      <main className="flex-grow">
        {/* Moving Marquee - Stock Prices */}
        <StockMarquee />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Live NEPSE Data */}
          <div className="mb-8 md:mb-12">
            <LiveNepseData />
          </div>

          {/* Market Phase Indicator */}
          <div className="mb-6">
            <MarketPhaseIndicator />
          </div>

          {/* Main Layout: Watchlist + All Stocks (Left) | Market Movers (Right) on Desktop */}
          <div className="mb-8 md:mb-12">
            {/* Mobile: Flex column with custom order | Desktop: Grid layout */}
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Watchlist - First on mobile, Left column on desktop */}
              <div className="order-1 lg:col-span-2 lg:order-none">
                <Watchlist />
              </div>

              {/* Market Movers - Second on mobile, Right column on desktop */}
              <div className="order-2 lg:col-span-1 lg:row-span-2 lg:order-none">
                <HomePageData />
              </div>
              
              {/* All Stocks - Third on mobile, Left column on desktop */}
              <div className="order-3 lg:col-span-2 lg:order-none">
                <AllStocks />
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
