import { useState, useEffect } from 'react';
import { Schedule, Lesson } from '../components/Calendar/types';
import { 
  generateTimeSlots, 
  isTimeInSchedule, 
  getLessonForTimeSlot,
  addDays 
} from '../utils/dateUtils';

export const useCalendar = (
  startDate: Date,
  schedule: Schedule[],
  lessons: Lesson[],
  view: 'day' | '3days' | 'week'
) => {
  const [currentStartDate, setCurrentStartDate] = useState<Date>(startDate);
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    setTimeSlots(generateTimeSlots(0, 24, 30));
  }, []);

  useEffect(() => {
    const daysCount = view === 'week' ? 7 : view === '3days' ? 3 : 1;
    const newDays = Array.from({ length: daysCount }, (_, i) => 
      addDays(currentStartDate, i)
    );
    setDays(newDays);
  }, [currentStartDate, view]);

  const getSlotType = (
    time: Date, 
    day: Date, 
    lesson: Lesson | null
  ): 'available' | 'booked' | 'blocked' => {
    if (lesson) return 'booked';
    if (isTimeInSchedule(time, schedule, day)) return 'available';
    return 'blocked';
  };

  const navigate = (direction: 'prev' | 'next') => {
    const increment = view === 'week' ? 7 : view === '3days' ? 3 : 1;
    const change = direction === 'next' ? increment : -increment;
    setCurrentStartDate(prev => addDays(prev, change));
  };

  return {
    currentStartDate,
    timeSlots,
    days,
    navigate,
    getSlotType
  };
};