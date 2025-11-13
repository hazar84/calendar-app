import React from 'react';
import { CalendarProps, Lesson } from './types';
import { useCalendar } from '../../hooks/useCalendar';
import { CalendarNavigation } from './CalendarNavigation';
import { formatTime, formatDate, getLessonForTimeSlot } from '../../utils/dateUtils';

export const Calendar: React.FC<CalendarProps> = ({
  view = 'week',
  startDate,
  schedule = [],
  lessons = [],
  onSlotSelect
}) => {
  const {
    currentStartDate,
    timeSlots,
    days,
    navigate,
    getSlotType
  } = useCalendar(startDate, schedule, lessons, view);

  const handleSlotClick = (time: Date, day: Date, lesson: Lesson | null) => {
    const slotType = getSlotType(time, day, lesson);
    
    if (slotType === 'blocked') return;
    
    const slotStart = new Date(day);
    slotStart.setHours(time.getHours(), time.getMinutes());
    
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);
    
    if (lesson) {
      alert(`Урок с ${lesson.student}\nВремя: ${formatTime(new Date(lesson.startTime))} - ${formatTime(new Date(lesson.endTime))}\nПродолжительность: ${lesson.duration} минут`);
    } else if (slotType === 'available') {
      if (onSlotSelect) {
        onSlotSelect({ startTime: slotStart, endTime: slotEnd });
      }
      alert(`Выбран слот: ${formatTime(slotStart)} - ${formatTime(slotEnd)}`);
    }
  };

  const getSlotClassName = (time: Date, day: Date, lesson: Lesson | null): string => {
    let classNames = 'calendar-slot';
    const slotType = getSlotType(time, day, lesson);
    
    // Добавляем класс типа слота
    switch (slotType) {
      case 'available':
        classNames += ' slot-available';
        break;
      case 'booked':
        classNames += ' slot-booked';
        break;
      case 'blocked':
        classNames += ' slot-blocked';
        break;
      default:
        break;
    }

    // ⬇️ ДОБАВЛЕНО: Убираем границы внутри одного урока
    if (lesson) {
      const lessonStart = new Date(lesson.startTime);
      const lessonEnd = new Date(lesson.endTime);
      const currentTime = new Date(day);
      currentTime.setHours(time.getHours(), time.getMinutes());
      
      // Если это не начало урока - убираем верхнюю границу
      if (currentTime.getTime() !== lessonStart.getTime()) {
        classNames += ' no-top-border';
      }
      
      // Если это не конец урока - убираем нижнюю границу
      const nextSlotTime = new Date(currentTime);
      nextSlotTime.setMinutes(nextSlotTime.getMinutes() + 30);
      if (nextSlotTime.getTime() < lessonEnd.getTime()) {
        classNames += ' no-bottom-border';
      }
    }
    
    return classNames;
  };

  const isLessonStart = (time: Date, lesson: Lesson | null, day: Date): boolean => {
    if (!lesson) return false;
    
    const lessonStart = new Date(lesson.startTime);
    const checkTime = new Date(day);
    checkTime.setHours(time.getHours(), time.getMinutes());
    
    return checkTime.getTime() === lessonStart.getTime();
  };

  const getGridClassName = (): string => {
    switch (view) {
      case 'week':
        return 'calendar-grid calendar-week';
      case '3days':
        return 'calendar-grid calendar-3days';
      case 'day':
        return 'calendar-grid calendar-day';
      default:
        return 'calendar-grid calendar-week';
    }
  };

  return (
    <div className="calendar">
      <CalendarNavigation
        currentStartDate={currentStartDate}
        view={view}
        onNavigate={navigate}
      />
      
      <div className={getGridClassName()}>
        {/* Time labels column */}
        <div className="time-column">
          <div className="time-header"></div>
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className="time-slot"
            >
              {formatTime(time)}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            {/* Day header */}
            <div className="day-header">
              {formatDate(day)}
            </div>

            {/* Time slots */}
            {timeSlots.map((time, timeIndex) => {
              const lesson = getLessonForTimeSlot(time, lessons, day);
              const showStudentName = isLessonStart(time, lesson, day);
              
              return (
                <div
                  key={timeIndex}
                  className={getSlotClassName(time, day, lesson)}
                  onClick={() => handleSlotClick(time, day, lesson)}
                  title={
                    lesson 
                      ? `Урок с ${lesson.student} (${lesson.duration} мин)`
                      : 'Доступный слот - 30 минут'
                  }
                >
                  {showStudentName && (
                    <div className="student-name">
                      {lesson!.student}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};