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

  // Legacy method names for backward compatibility
  getLiveNepse: async () => {
    return api.getAllStocks();
  },

  getHomePageData: async () => {
    return api.getLiveData();
  },
};

export default api;
