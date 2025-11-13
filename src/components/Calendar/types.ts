export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  type: 'available' | 'booked' | 'blocked';
  lesson?: Lesson;
}

export interface Schedule {
  startTime: string;
  endTime: string;
}

export interface Lesson {
  id: number;
  duration: number;
  startTime: string;
  endTime: string;
  student: string;
}

export interface CalendarProps {
  view: 'day' | '3days' | 'week';
  startDate: Date;
  schedule: Schedule[];
  lessons: Lesson[];
  onSlotSelect?: (slot: { startTime: Date; endTime: Date }) => void;
}

export interface CalendarNavigationProps {
  currentStartDate: Date;
  view: 'day' | '3days' | 'week';
  onNavigate: (direction: 'prev' | 'next') => void;
}