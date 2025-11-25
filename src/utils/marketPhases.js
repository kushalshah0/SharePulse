/**
 * NEPSE Market Phases Utility
 * 
 * Trading Schedule (Nepal Time - UTC+5:45):
 * - Pre-Opening: 10:30 AM - 10:45 AM (Order placement, no execution)
 * - Regular Trading: 11:00 AM - 3:00 PM (Active trading)
 * - Closed: Outside trading hours
 */

export const MARKET_PHASES = {
  PRE_OPENING: 'PRE_OPENING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  POST_CLOSE: 'POST_CLOSE', // Brief period after market closes (3:00 PM - 3:15 PM)
};

export const PHASE_CONFIG = {
  [MARKET_PHASES.PRE_OPENING]: {
    label: 'Pre-Opening Session',
    description: 'Order placement only, no execution',
    color: 'orange',
    icon: '⏰',
    pollingInterval: {
      liveData: 10000, // 10 seconds - moderate updates
      allStocks: 15000, // 15 seconds
    },
  },
  [MARKET_PHASES.OPEN]: {
    label: 'Market Open',
    description: 'Active trading in progress',
    color: 'green',
    icon: '📈',
    pollingInterval: {
      liveData: 5000, // 5 seconds - fast updates
      allStocks: 10000, // 10 seconds
    },
  },
  [MARKET_PHASES.CLOSED]: {
    label: 'Market Closed',
    description: 'Trading session ended',
    color: 'gray',
    icon: '🔒',
    pollingInterval: {
      liveData: null, // No polling
      allStocks: null,
    },
  },
  [MARKET_PHASES.POST_CLOSE]: {
    label: 'Post-Close',
    description: 'Final calculations in progress',
    color: 'blue',
    icon: '📊',
    pollingInterval: {
      liveData: 30000, // 30 seconds - slow updates
      allStocks: 60000, // 1 minute
    },
  },
};

/**
 * Get current market phase based on Nepal time
 * @param {Date} now - Current date/time (defaults to now)
 * @returns {string} Current market phase
 */
export function getCurrentMarketPhase(now = new Date()) {
  // Convert to Nepal Time (UTC+5:45)
  const nepalTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }));
  
  const hours = nepalTime.getHours();
  const minutes = nepalTime.getMinutes();
  const day = nepalTime.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Check if it's a weekend (Sunday = 0, Saturday = 6)
  if (day === 0 || day === 6) {
    return MARKET_PHASES.CLOSED;
  }
  
  // Convert time to minutes since midnight for easier comparison
  const currentMinutes = hours * 60 + minutes;
  
  // Pre-Opening: 10:30 AM - 10:45 AM (630 - 645 minutes)
  const preOpeningStart = 10 * 60 + 30; // 630
  const preOpeningEnd = 10 * 60 + 45; // 645
  
  // Regular Trading: 11:00 AM - 3:00 PM (660 - 900 minutes)
  const tradingStart = 11 * 60; // 660
  const tradingEnd = 15 * 60; // 900
  
  // Post-Close: 3:00 PM - 3:15 PM (900 - 915 minutes)
  const postCloseEnd = 15 * 60 + 15; // 915
  
  if (currentMinutes >= preOpeningStart && currentMinutes < preOpeningEnd) {
    return MARKET_PHASES.PRE_OPENING;
  } else if (currentMinutes >= tradingStart && currentMinutes < tradingEnd) {
    return MARKET_PHASES.OPEN;
  } else if (currentMinutes >= tradingEnd && currentMinutes < postCloseEnd) {
    return MARKET_PHASES.POST_CLOSE;
  } else {
    return MARKET_PHASES.CLOSED;
  }
}

/**
 * Get time until next market phase change
 * @param {Date} now - Current date/time (defaults to now)
 * @returns {Object} { phase: string, timeUntilChange: number (ms), nextPhase: string }
 */
export function getTimeUntilNextPhase(now = new Date()) {
  const nepalTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }));
  const currentPhase = getCurrentMarketPhase(now);
  
  const hours = nepalTime.getHours();
  const minutes = nepalTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  
  let nextPhaseMinutes;
  let nextPhase;
  
  // Define phase transition times
  const preOpeningStart = 10 * 60 + 30; // 10:30 AM
  const tradingStart = 11 * 60; // 11:00 AM
  const tradingEnd = 15 * 60; // 3:00 PM
  const postCloseEnd = 15 * 60 + 15; // 3:15 PM
  
  if (currentPhase === MARKET_PHASES.PRE_OPENING) {
    nextPhaseMinutes = tradingStart;
    nextPhase = MARKET_PHASES.OPEN;
  } else if (currentPhase === MARKET_PHASES.OPEN) {
    nextPhaseMinutes = tradingEnd;
    nextPhase = MARKET_PHASES.POST_CLOSE;
  } else if (currentPhase === MARKET_PHASES.POST_CLOSE) {
    nextPhaseMinutes = postCloseEnd;
    nextPhase = MARKET_PHASES.CLOSED;
  } else {
    // Market is closed, next is pre-opening tomorrow (or Monday if weekend)
    let daysUntilNext = 1;
    const tomorrow = new Date(nepalTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // If tomorrow is Saturday or Sunday, skip to Monday
    while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
      tomorrow.setDate(tomorrow.getDate() + 1);
      daysUntilNext++;
    }
    
    nextPhaseMinutes = preOpeningStart + (daysUntilNext - 1) * 24 * 60;
    nextPhase = MARKET_PHASES.PRE_OPENING;
  }
  
  const minutesUntilChange = nextPhaseMinutes - currentMinutes;
  const msUntilChange = minutesUntilChange * 60 * 1000;
  
  return {
    currentPhase,
    timeUntilChange: msUntilChange > 0 ? msUntilChange : 0,
    nextPhase,
  };
}

/**
 * Check if market is in an active phase (pre-opening, open, or post-close)
 * @param {Date} now - Current date/time (defaults to now)
 * @returns {boolean}
 */
export function isMarketActive(now = new Date()) {
  const phase = getCurrentMarketPhase(now);
  return phase !== MARKET_PHASES.CLOSED;
}

/**
 * Get polling intervals for current market phase
 * @param {Date} now - Current date/time (defaults to now)
 * @returns {Object} { liveData: number|null, allStocks: number|null }
 */
export function getPollingIntervals(now = new Date()) {
  const phase = getCurrentMarketPhase(now);
  return PHASE_CONFIG[phase].pollingInterval;
}

/**
 * Format time until next phase for display
 * @param {number} ms - Milliseconds until change
 * @returns {string} Formatted time string
 */
export function formatTimeUntilChange(ms) {
  if (ms <= 0) return 'Any moment now';
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Get market phase configuration
 * @param {string} phase - Market phase
 * @returns {Object} Phase configuration
 */
export function getPhaseConfig(phase) {
  return PHASE_CONFIG[phase] || PHASE_CONFIG[MARKET_PHASES.CLOSED];
}
