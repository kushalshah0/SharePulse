'use client';

import React from 'react';
import { ChartBarIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* About */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">SharePulse</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Real-time market data and insights for Nepal Stock Exchange
              </p>
            </div>
          </div>
          
          {/* Market Info */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex-shrink-0">
              <ClockIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Trading Hours</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Sun-Thu: 11:00 AM - 3:00 PM NPT
              </p>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Disclaimer</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Trading involves risk. Invest responsibly
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {currentYear} SharePulse. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Data provided for informational purposes only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
