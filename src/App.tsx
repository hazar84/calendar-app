import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar/Calendar';
import { Schedule, Lesson } from './components/Calendar/types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'day' | '3days' | 'week'>('week');
  
  // Автоматическое переключение видов по размеру экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentView('day');
      } else if (window.innerWidth < 1024) {
        setCurrentView('3days');
      } else {
        setCurrentView('week');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Данные расписания из ТЗ
  const schedule: Schedule[] = [
    {
      "startTime": "2025-08-23T22:30:00+00:00",
      "endTime": "2025-08-24T02:29:59+00:00"
    },
    {
      "startTime": "2025-08-25T01:30:00+00:00",
      "endTime": "2025-08-25T04:59:59+00:00"
    },
    {
      "startTime": "2025-08-25T11:00:00+00:00",
      "endTime": "2025-08-25T19:29:59+00:00"
    },
    {
      "startTime": "2025-08-27T02:30:00+00:00",
      "endTime": "2025-08-27T06:59:59+00:00"
    },
    {
      "startTime": "2025-08-28T23:00:00+00:00",
      "endTime": "2025-08-29T08:29:59+00:00"
    }
  ];

  const lessons: Lesson[] = [
    {
      "id": 52,
      "duration": 60,
      "startTime": "2025-08-25T13:30:00+00:00",
      "endTime": "2025-08-25T14:29:59+00:00",
      "student": "Alex"
    },
    {
      "id": 53,
      "duration": 90,
      "startTime": "2025-08-25T15:00:00+00:00",
      "endTime": "2025-08-25T16:29:59+00:00",
      "student": "Maria"
    },
    {
      "id": 54,
      "duration": 30,
      "startTime": "2025-08-27T03:00:00+00:00",
      "endTime": "2025-08-27T03:29:59+00:00",
      "student": "John"
    }
  ];

  const handleSlotSelect = (slot: { startTime: Date; endTime: Date }) => {
    console.log('Selected available slot:', slot);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <header className="app-header">
          <h1 className="app-title">Расписание преподавателя</h1>
          <p className="app-subtitle">Календарь с 30-минутными интервалами</p>
        </header>
        
        {/* Легенда */}
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Доступные слоты</span>
          </div>
          <div className="legend-item">
            <div className="legend-color booked"></div>
            <span>Занятые уроки</span>
          </div>
          <div className="legend-item">
            <div className="legend-color blocked"></div>
            <span>Недоступно</span>
          </div>
        </div>

        {/* Переключатель видов для ручного управления */}
        <div className="view-switcher">
          <span className="view-label">Вид:</span>
          <button
            onClick={() => setCurrentView('day')}
            className={`view-button ${currentView === 'day' ? 'active' : ''}`}
          >
            День
          </button>
          <button
            onClick={() => setCurrentView('3days')}
            className={`view-button ${currentView === '3days' ? 'active' : ''}`}
          >
            3 дня
          </button>
          <button
            onClick={() => setCurrentView('week')}
            className={`view-button ${currentView === 'week' ? 'active' : ''}`}
          >
            Неделя
          </button>
        </div>

        <Calendar
          view={currentView}
          startDate={new Date('2025-08-25')}
          schedule={schedule}
          lessons={lessons}
          onSlotSelect={handleSlotSelect}
        />

        <footer className="app-footer">
          <p>Кликните на доступный слот (зеленый) для выбора времени</p>
          <p>Кликните на занятый урок (красный) для просмотра информации</p>
        </footer>
      </div>
    </div>
  );
};

export default App;