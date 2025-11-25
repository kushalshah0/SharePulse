'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { 
  getCurrentMarketPhase, 
  getPollingIntervals, 
  isMarketActive,
  MARKET_PHASES 
} from '../utils/marketPhases';

const MarketDataContext = createContext();

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within MarketDataProvider');
  }
  return context;
};

export const MarketDataProvider = ({ children }) => {
  // Live data (market summary, indices, top gainers/losers)
  const [liveData, setLiveData] = useState(null);
  const [liveDataLoading, setLiveDataLoading] = useState(true);
  const [liveDataError, setLiveDataError] = useState(null);

  // All stocks data
  const [allStocks, setAllStocks] = useState([]);
  const [allStocksLoading, setAllStocksLoading] = useState(true);
  const [allStocksError, setAllStocksError] = useState(null);

  // Market status
  const [marketPhase, setMarketPhase] = useState(() => getCurrentMarketPhase());
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [hasInitialData, setHasInitialData] = useState(false);

  // Fetch live data with retry logic
  const fetchLiveData = async (retryCount = 0, maxRetries = 3) => {
    try {
      const data = await api.getLiveData();
      setLiveData(data);
      setLiveDataError(null);
      setLiveDataLoading(false);
      setHasInitialData(true);
      
      // Update market status from live data
      if (data && data.marketStatus) {
        const status = data.marketStatus.status;
        setIsMarketOpen(status === 'OPEN' || status === 'Open');
      }
      
      return true; // Success
    } catch (err) {
      console.error(`Error fetching live data (attempt ${retryCount + 1}/${maxRetries + 1}):`, err);
      
      // Retry logic
      if (retryCount < maxRetries) {
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff: 1s, 2s, 4s, max 10s
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchLiveData(retryCount + 1, maxRetries);
      }
      
      // All retries failed
      setLiveDataError('Failed to fetch live data');
      setLiveDataLoading(false);
      return false; // Failed
    }
  };

  // Fetch all stocks with retry logic
  const fetchAllStocks = async (retryCount = 0, maxRetries = 3) => {
    try {
      const response = await api.getAllStocks();
      // Handle both possible data structures: response.data or response.liveStocks
      const stocksData = response.data || response.liveStocks || [];
      if (stocksData && stocksData.length > 0) {
        // Remove duplicates based on symbol
        const uniqueStocks = Array.from(
          new Map(stocksData.map(stock => [stock.symbol, stock])).values()
        );
        setAllStocks(uniqueStocks);
        setAllStocksError(null);
        setAllStocksLoading(false);
      } else {
        setAllStocks([]);
        setAllStocksLoading(false);
      }
      
      return true; // Success
    } catch (err) {
      console.error(`Error fetching all stocks (attempt ${retryCount + 1}/${maxRetries + 1}):`, err);
      
      // Retry logic
      if (retryCount < maxRetries) {
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff: 1s, 2s, 4s, max 10s
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchAllStocks(retryCount + 1, maxRetries);
      }
      
      // All retries failed
      setAllStocksError('Failed to fetch stocks data');
      setAllStocksLoading(false);
      return false; // Failed
    }
  };

  // Initial fetch and setup intervals
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Fetch immediately on mount
    fetchLiveData();
    fetchAllStocks();

    // No intervals on initial mount - they will be set up by the market status effect
    // This prevents double interval setup
  }, []);

  // Monitor market phase changes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Update market phase every 30 seconds
    const phaseCheckInterval = setInterval(() => {
      const currentPhase = getCurrentMarketPhase();
      setMarketPhase(currentPhase);
      
      // Update isMarketOpen for backward compatibility
      setIsMarketOpen(currentPhase === MARKET_PHASES.OPEN);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(phaseCheckInterval);
  }, []);

  // Update intervals based on market phase
  useEffect(() => {
    // Skip until we have initial data
    if (!hasInitialData) return;

    // Only run on client side
    if (typeof window === 'undefined') return;

    let liveDataInterval;
    let allStocksInterval;

    // Get polling intervals for current market phase
    const intervals = getPollingIntervals();
    
    console.log(`Market Phase: ${marketPhase}`, intervals);

    if (intervals.liveData && intervals.allStocks) {
      // Market is active (pre-opening, open, or post-close) - start polling
      console.log(`Starting polling - Live: ${intervals.liveData}ms, Stocks: ${intervals.allStocks}ms`);
      liveDataInterval = setInterval(fetchLiveData, intervals.liveData);
      allStocksInterval = setInterval(fetchAllStocks, intervals.allStocks);
    } else {
      // Market is closed - no polling
      console.log('Market is CLOSED - No automatic polling (data fetched once)');
    }

    // Cleanup intervals when market phase changes or component unmounts
    return () => {
      if (liveDataInterval) clearInterval(liveDataInterval);
      if (allStocksInterval) clearInterval(allStocksInterval);
    };
  }, [marketPhase, hasInitialData]);

  const value = {
    // Live data
    liveData,
    liveDataLoading,
    liveDataError,
    refreshLiveData: fetchLiveData,

    // All stocks data
    allStocks,
    allStocksLoading,
    allStocksError,
    refreshAllStocks: fetchAllStocks,

    // Market status
    marketPhase,
    isMarketOpen,
    isMarketActive: isMarketActive(),
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};
