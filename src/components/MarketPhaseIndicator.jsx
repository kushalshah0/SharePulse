'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/solid';
import { 
  getCurrentMarketPhase, 
  getTimeUntilNextPhase, 
  getPhaseConfig,
  formatTimeUntilChange,
  MARKET_PHASES 
} from '../utils/marketPhases';

const MarketPhaseIndicator = () => {
  const [phaseInfo, setPhaseInfo] = useState(() => {
    const info = getTimeUntilNextPhase();
    return {
      ...info,
      config: getPhaseConfig(info.currentPhase),
    };
  });

  useEffect(() => {
    // Update phase info every second
    const interval = setInterval(() => {
      const info = getTimeUntilNextPhase();
      setPhaseInfo({
        ...info,
        config: getPhaseConfig(info.currentPhase),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { currentPhase, timeUntilChange, nextPhase, config } = phaseInfo;

  // Only show indicator during Pre-Opening and Post-Close phases
  if (currentPhase === MARKET_PHASES.CLOSED || currentPhase === MARKET_PHASES.OPEN) {
    return null;
  }

  // Color classes based on phase (only orange for pre-opening and blue for post-close)
  const getColorClasses = () => {
    if (currentPhase === MARKET_PHASES.PRE_OPENING) {
      return {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-400',
        badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
        icon: 'text-orange-600 dark:text-orange-400',
      };
    }
    // POST_CLOSE
    return {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-400',
      badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
    };
  };

  const colors = getColorClasses();

  // Get appropriate icon based on phase
  const getPhaseIcon = () => {
    if (currentPhase === MARKET_PHASES.PRE_OPENING) {
      return <ClockIcon className={`h-5 w-5 ${colors.icon} animate-pulse`} />;
    }
    return <InformationCircleIcon className={`h-5 w-5 ${colors.icon}`} />;
  };

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getPhaseIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-sm font-bold ${colors.text}`}>
              {config.icon} {config.label}
            </h3>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {config.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-500">
              {currentPhase === MARKET_PHASES.PRE_OPENING ? 'Trading starts in:' : 'Market closed in:'}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${colors.badge} font-mono font-medium`}>
              {formatTimeUntilChange(timeUntilChange)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Additional info for pre-opening */}
      {currentPhase === MARKET_PHASES.PRE_OPENING && (
        <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-2">
            <InformationCircleIcon className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              During pre-opening, you can place and modify orders, but no trades are executed. 
              Trading begins at 11:00 AM.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPhaseIndicator;
