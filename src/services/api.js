import axios from 'axios';

// Use internal API routes instead of direct external API calls
const BASE_URL = '/api/nepse';

// Request deduplication layer
const pendingRequests = new Map();
const requestCache = new Map();
const CACHE_TTL = 5000; // 5 seconds cache

const deduplicatedRequest = async (key, requestFn) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const promise = requestFn();
  pendingRequests.set(key, promise);

  try {
    const data = await promise;
    requestCache.set(key, { data, timestamp: Date.now() });
    return data;
  } finally {
    pendingRequests.delete(key);
  }
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions matching component names
export const api = {
  // Get market status (open/closed) - used by multiple components
  getMarketStatus: async () => {
    return deduplicatedRequest('market-status', async () => {
      try {
        const response = await apiClient.get('/market-status');
        return response.data;
      } catch (error) {
        console.error('Error fetching market status:', error);
        throw error;
      }
    });
  },

  // Get all stocks data - used by AllStocks component
  getAllStocks: async () => {
    return deduplicatedRequest('all-stocks', async () => {
      try {
        const response = await apiClient.get('/all-stocks');
        return response.data;
      } catch (error) {
        console.error('Error fetching all stocks data:', error);
        throw error;
      }
    });
  },

  // Get live data (market summary, indices, top gainers/losers) - used by LiveNepseData component
  getLiveData: async () => {
    return deduplicatedRequest('live-data', async () => {
      try {
        const response = await apiClient.get('/live-data');
        return response.data;
      } catch (error) {
        console.error('Error fetching live data:', error);
        throw error;
      }
    });
  },

  // Get floorsheet data - used by Floorsheet page
  getFloorsheet: async (size = 20, page = 1, symbol = '') => {
    const key = `floorsheet:${size}:${page}:${symbol}`;
    return deduplicatedRequest(key, async () => {
      try {
        let url = `/floorsheet?size=${size}&page=${page}`;
        if (symbol) {
          url += `&symbol=${encodeURIComponent(symbol)}`;
        }
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching floorsheet data:', error);
        throw error;
      }
    });
  },

  // Legacy method names for backward compatibility
  getLiveNepse: async () => {
    return api.getAllStocks();
  },

  getHomePageData: async () => {
    return api.getLiveData();
  },

  getCompanyOverview: async (symbol) => {
    const key = `company-overview:${symbol}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/overview?symbol=${encodeURIComponent(symbol)}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching company overview:', error);
        throw error;
      }
    });
  },

  getCompanyMarketDepth: async (symbol) => {
    const key = `company-market-depth:${symbol}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/market-depth?symbol=${encodeURIComponent(symbol)}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching market depth:', error);
        throw error;
      }
    });
  },

  getCompanyFloorsheet: async (symbol, size = 10, page = 1) => {
    const key = `company-floorsheet:${symbol}:${size}:${page}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/floorsheet?symbol=${encodeURIComponent(symbol)}&size=${size}&page=${page}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching company floorsheet:', error);
        throw error;
      }
    });
  },

  getCompanyBulkTransactions: async (symbol, pageSize = 10, minimumQuantity = 3000) => {
    const key = `company-bulk:${symbol}:${pageSize}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/bulk-transactions?symbol=${encodeURIComponent(symbol)}&pageSize=${pageSize}&MinimumQuantity=${minimumQuantity}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching bulk transactions:', error);
        throw error;
      }
    });
  },

  getCompanyPriceHistory: async (symbol, pageSize = 10, page = 1) => {
    const key = `company-price-history:${symbol}:${pageSize}:${page}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/price-history?symbol=${encodeURIComponent(symbol)}&pageSize=${pageSize}&page=${page}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching price history:', error);
        throw error;
      }
    });
  },

  getCompanyDividend: async (symbol, limit = 50, page = 1) => {
    const key = `company-dividend:${symbol}:${limit}:${page}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/dividend?symbol=${encodeURIComponent(symbol)}&limit=${limit}&page=${page}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching dividend:', error);
        throw error;
      }
    });
  },

  getCompanyRightShares: async (symbol, pageSize = 10) => {
    const key = `company-right-shares:${symbol}:${pageSize}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/right-shares?symbol=${encodeURIComponent(symbol)}&pageSize=${pageSize}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching right shares:', error);
        throw error;
      }
    });
  },

  getCompanyNews: async (symbol, limit = 6) => {
    const key = `company-news:${symbol}:${limit}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/news?symbol=${encodeURIComponent(symbol)}&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
    });
  },

  getCompanyAnnouncements: async (symbol, size = 8, page = 1) => {
    const key = `company-announcements:${symbol}:${size}:${page}`;
    return deduplicatedRequest(key, async () => {
      try {
        const response = await apiClient.get(`/company/announcements?symbol=${encodeURIComponent(symbol)}&size=${size}&page=${page}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }
    });
  },
};

export default api;
