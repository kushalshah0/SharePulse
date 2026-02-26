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
        
        // Cache the data for offline/closed market use
        localStorage.setItem('all_stocks_cache', JSON.stringify(uniqueStocks));
        localStorage.setItem('all_stocks_cache_time', Date.now().toString());
      } else {
        setAllStocks([]);
        setAllStocksLoading(false);
      }
      
      return true; // Success
    } catch (err) {
      console.error(`Error fetching all stocks (attempt ${retryCount + 1}/${maxRetries + 1}):`, err);
      
      // Try to load from cache on error
      const cached = localStorage.getItem('all_stocks_cache');
      if (cached) {
        console.log('Loading stocks from cache');
        setAllStocks(JSON.parse(cached));
        setAllStocksLoading(false);
        return true;
      }
      
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
    
    // Check if market is active
    const currentPhase = getCurrentMarketPhase();
    setMarketPhase(currentPhase);
    setIsMarketOpen(currentPhase === MARKET_PHASES.OPEN);

    // Always try to fetch data - API should still work outside market hours
    console.log(`Fetching data (market phase: ${currentPhase})`);
    fetchLiveData();
    fetchAllStocks();
  }, []);

  // Monitor market phase changes and set up polling
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Skip if we haven't fetched initial data yet
    if (!hasInitialData) return;

    // Update market phase every 30 seconds
    const phaseCheckInterval = setInterval(() => {
      const currentPhase = getCurrentMarketPhase();
      setMarketPhase(currentPhase);
      setIsMarketOpen(currentPhase === MARKET_PHASES.OPEN);
    }, 30000); // Check every 30 seconds

    // Only set up polling if market is active
    const intervals = getPollingIntervals();
    
    let liveDataInterval;
    let allStocksInterval;

    if (intervals.liveData && intervals.allStocks) {
      console.log(`Market is active - setting up polling`);
      liveDataInterval = setInterval(fetchLiveData, intervals.liveData);
      allStocksInterval = setInterval(fetchAllStocks, intervals.allStocks);
    } else {
      console.log(`Market is closed - no polling`);
    }

    return () => {
      clearInterval(phaseCheckInterval);
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
