'use client';

import React from 'react';

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>© {currentYear} SharePulse</span>
          <span>Data for informational purposes only</span>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
