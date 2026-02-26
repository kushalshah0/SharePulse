'use client';

import { useEffect, useState } from 'react';
import { NewspaperIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';

const CompanyNews = ({ symbol, compact = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getCompanyNews(symbol, compact ? 3 : 6);
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, compact]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${compact ? 'h-full' : ''}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || !data.content || data.content.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${compact ? 'h-full' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <NewspaperIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">News</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">No news</p>
        </div>
      </div>
    );
  }

  const newsData = data?.content || [];
  const displayData = compact ? newsData.slice(0, 3) : newsData.slice(0, 6);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${compact ? 'h-full' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <NewspaperIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">News</h3>
      </div>
      
      <div className={`space-y-2 ${compact ? 'max-h-[200px] overflow-y-auto' : ''}`}>
        {displayData.map((item, index) => (
          <a
            key={index}
            href={item.url || item.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-xs">
                {item.title}
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(item.publishedDate || item.date)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CompanyNews;
