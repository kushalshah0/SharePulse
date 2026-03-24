import axios from 'axios';

// Use internal API routes instead of direct external API calls
const BASE_URL = '/api/nepse';

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
    try {
      const response = await apiClient.get('/market-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching market status:', error);
      throw error;
    }
  },

  // Get all stocks data - used by AllStocks component
  getAllStocks: async () => {
    try {
      const response = await apiClient.get('/all-stocks');
      return response.data;
    } catch (error) {
      console.error('Error fetching all stocks data:', error);
      throw error;
    }
  },

  // Get live data (market summary, indices, top gainers/losers) - used by LiveNepseData component
  getLiveData: async () => {
    try {
      const response = await apiClient.get('/live-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching live data:', error);
      throw error;
    }
  },

  // Get floorsheet data - used by Floorsheet page
  getFloorsheet: async (size = 20, page = 1, symbol = '') => {
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
  },

  // Legacy method names for backward compatibility
  getLiveNepse: async () => {
    return api.getAllStocks();
  },

  getHomePageData: async () => {
    return api.getLiveData();
  },

  getCompanyOverview: async (symbol) => {
    try {
      const response = await apiClient.get(`/company/overview?symbol=${encodeURIComponent(symbol)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company overview:', error);
      throw error;
    }
  },

  getCompanyMarketDepth: async (symbol) => {
    try {
      const response = await apiClient.get(`/company/market-depth?symbol=${encodeURIComponent(symbol)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market depth:', error);
      throw error;
    }
  },

  getCompanyFloorsheet: async (symbol, size = 10, page = 1) => {
    try {
      const response = await apiClient.get(`/company/floorsheet?symbol=${encodeURIComponent(symbol)}&size=${size}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company floorsheet:', error);
      throw error;
    }
  },

  getCompanyBulkTransactions: async (symbol, pageSize = 10, minimumQuantity = 3000) => {
    try {
      const response = await apiClient.get(`/company/bulk-transactions?symbol=${encodeURIComponent(symbol)}&pageSize=${pageSize}&MinimumQuantity=${minimumQuantity}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bulk transactions:', error);
      throw error;
    }
  },

  getCompanyPriceHistory: async (symbol, pageSize = 10, page = 1) => {
    try {
      const response = await apiClient.get(`/company/price-history?symbol=${encodeURIComponent(symbol)}&pageSize=${pageSize}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  },

  getCompanyDividend: async (symbol, limit = 50, page = 1) => {
    try {
      const response = await apiClient.get(`/company/dividend?symbol=${encodeURIComponent(symbol)}&limit=${limit}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dividend:', error);
      throw error;
    }
  },

  getCompanyNews: async (symbol, limit = 6) => {
    try {
      const response = await apiClient.get(`/company/news?symbol=${encodeURIComponent(symbol)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  getCompanyAnnouncements: async (symbol, size = 8, page = 1) => {
    try {
      const response = await apiClient.get(`/company/announcements?symbol=${encodeURIComponent(symbol)}&size=${size}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },
};

export default api;
