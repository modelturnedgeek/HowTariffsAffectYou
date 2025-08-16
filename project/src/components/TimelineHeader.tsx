import React from 'react';

interface TimelineHeaderProps {
  startDate: Date;
  endDate: Date;
  cellWidth: number;
  scale: 'day' | 'week' | 'month';
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  startDate,
  endDate,
  cellWidth,
  scale
}) => {
  const generateTimelineHeaders = () => {
    const headers = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      if (scale === 'day') {
        const monthName = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        headers.push({
          label: monthName,
          date: new Date(current),
          isWeekend: current.getDay() === 0 || current.getDay() === 6
        });
        current.setDate(current.getDate() + 1);
      } else if (scale === 'week') {
        const weekStart = new Date(current);
        weekStart.setDate(current.getDate() - current.getDay());
        const monthName = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        headers.push({
          label: monthName,
          date: new Date(current),
          isWeekend: false
        });
        current.setDate(current.getDate() + 7);
      } else {
        const monthName = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        headers.push({
          label: monthName,
          date: new Date(current),
          isWeekend: false
        });
        current.setMonth(current.getMonth() + 1);
      }
    }
    
    return headers;
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const headers = generateTimelineHeaders();

  return (
    <div className="flex bg-gray-50 border-b border-gray-200" style={{ minWidth: headers.length * cellWidth }}>
      {headers.map((header, index) => (
        <div
          key={index}
          className={`border-r border-gray-200 flex-shrink-0 px-2 py-3 text-center ${
            header.isWeekend ? 'bg-gray-100' : ''
          }`}
          style={{ width: cellWidth }}
        >
          <div className="text-xs font-medium text-gray-700">{header.label}</div>
        </div>
      ))}
    </div>
  );
};