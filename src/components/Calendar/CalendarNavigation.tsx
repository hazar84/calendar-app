import React from 'react';
import { CalendarNavigationProps } from './types';
import { formatDate, addDays } from '../../utils/dateUtils';

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  currentStartDate,
  view,
  onNavigate
}) => {
  const getViewTitle = (): string => {
    const endDate = addDays(currentStartDate, view === 'week' ? 6 : view === '3days' ? 2 : 0);
    
    if (view === 'day') {
      return formatDate(currentStartDate);
    }
    
    return `${formatDate(currentStartDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="calendar-header">
      <button
        onClick={() => onNavigate('prev')}
        className="nav-button"
        aria-label="Previous"
      >
        ‹
      </button>
      
      <h2 className="calendar-title">
        {getViewTitle()}
      </h2>
      
      <button
        onClick={() => onNavigate('next')}
        className="nav-button"
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
};