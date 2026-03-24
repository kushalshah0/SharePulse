'use client';

import { useEffect, useState } from 'react';
import { MegaphoneIcon, DocumentTextIcon, BuildingOfficeIcon, XMarkIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';

const CompanyAnnouncements = ({ symbol, compact = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.getCompanyAnnouncements(symbol, compact ? 3 : 8, 1);
        setData(response);
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
    return date.toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const handleCardClick = (item, e) => {
    e.preventDefault();
    setSelectedAnnouncement(item);
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
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
          <MegaphoneIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notices</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">No data</p>
        </div>
      </div>
    );
  }

  const displayData = compact ? data.content.slice(0, 3) : data.content;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${compact ? 'h-full' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <MegaphoneIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notices</h3>
      </div>
      
      <div className="space-y-2">
        {displayData.map((item, index) => (
          <div
            key={index}
            onClick={(e) => handleCardClick(item, e)}
            className="block group cursor-pointer"
          >
            <div className="h-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5 mb-1.5 text-[10px]">
                <BuildingOfficeIcon className="h-3 w-3 text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{item.symbol || symbol}</span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-400">NEPSE</span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">{item.category ? item.category.toUpperCase() : 'NEPSE'}</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-xs mb-1">
                {item.title || item.subject}
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {formatDate(item.announcementDate || item.date)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Announcement Details</h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="flex items-center gap-1.5 mb-3 text-xs">
                <BuildingOfficeIcon className="h-3 w-3 text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedAnnouncement.symbol}</span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-400">{selectedAnnouncement.securityName}</span>
              </div>
              <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500 dark:text-gray-400">
                <span>NEPSE</span>
                <span>•</span>
                <span className="text-purple-600 dark:text-purple-400">{selectedAnnouncement.category ? selectedAnnouncement.category.toUpperCase() : 'NEPSE'}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {selectedAnnouncement.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {formatDate(selectedAnnouncement.announcementDate)}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Details</h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {stripHtml(selectedAnnouncement.details)}
                </div>
              </div>
              {selectedAnnouncement.attachmentUrl && (
                <a
                  href={selectedAnnouncement.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <PaperClipIcon className="h-4 w-4" />
                  View Attachment
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAnnouncements;