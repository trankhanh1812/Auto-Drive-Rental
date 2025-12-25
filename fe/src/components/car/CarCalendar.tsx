'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface BookedDate {
  startDate: string;
  endDate: string;
  status: string;
}

interface CarCalendarProps {
  carId: number;
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void;
  bookedDates?: BookedDate[];
  minNights?: number;
}

export default function CarCalendar({ 
  carId, 
  onDateSelect, 
  bookedDates = [],
  minNights = 1 
}: CarCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  // Check if date is booked
  const isDateBooked = (date: Date) => {
    return bookedDates.some(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      date.setHours(12, 0, 0, 0);
      return date >= start && date <= end;
    });
  };

  // Check if date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if date is in selected range
  const isInSelectedRange = (date: Date) => {
    if (!selectedStartDate) return false;
    
    const checkDate = selectedEndDate || hoveredDate;
    if (!checkDate) return false;

    const start = new Date(selectedStartDate);
    const end = new Date(checkDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    date.setHours(12, 0, 0, 0);

    return date >= start && date <= end;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isPastDate(date) || isDateBooked(date)) return;

    if (!selectedStartDate) {
      // Select start date
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      onDateSelect?.(date, null);
    } else if (!selectedEndDate) {
      // Select end date
      if (date > selectedStartDate) {
        // Check if any booked dates in range
        const hasBookedInRange = bookedDates.some(booking => {
          const bookStart = new Date(booking.startDate);
          const bookEnd = new Date(booking.endDate);
          return (bookStart > selectedStartDate && bookStart < date) ||
                 (bookEnd > selectedStartDate && bookEnd < date);
        });

        if (!hasBookedInRange) {
          setSelectedEndDate(date);
          onDateSelect?.(selectedStartDate, date);
        } else {
          alert('Có ngày đã được đặt trong khoảng thời gian bạn chọn');
        }
      } else {
        // Reset and select new start date
        setSelectedStartDate(date);
        setSelectedEndDate(null);
        onDateSelect?.(date, null);
      }
    } else {
      // Reset and start over
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      onDateSelect?.(date, null);
    }
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isBooked = isDateBooked(date);
      const isPast = isPastDate(date);
      const isSelected = selectedStartDate?.toDateString() === date.toDateString() ||
                        selectedEndDate?.toDateString() === date.toDateString();
      const isInRange = isInSelectedRange(date);
      const isDisabled = isPast || isBooked;

      let dayClasses = 'p-2 text-center rounded-lg cursor-pointer transition-colors ';

      if (isDisabled) {
        dayClasses += 'bg-gray-100 text-gray-400 cursor-not-allowed line-through ';
      } else if (isSelected) {
        dayClasses += 'bg-purple-600 text-white font-bold ';
      } else if (isInRange) {
        dayClasses += 'bg-purple-100 text-purple-800 ';
      } else {
        dayClasses += 'hover:bg-purple-50 text-gray-900 ';
      }

      days.push(
        <div
          key={day}
          className={dayClasses}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => !isDisabled && setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <div className="text-sm">{day}</div>
          {isBooked && (
            <div className="text-xs text-red-600 font-medium">Đã đặt</div>
          )}
        </div>
      );
    }

    return days;
  };

  // Calculate total nights
  const getTotalNights = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const diffTime = selectedEndDate.getTime() - selectedStartDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-600" />
          Lịch cho thuê
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold px-4">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {generateCalendarDays()}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded"></div>
          <span className="text-gray-600">Ngày đã chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 rounded"></div>
          <span className="text-gray-600">Trong khoảng chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span className="text-gray-600 line-through">Không khả dụng</span>
        </div>
      </div>

      {/* Selected dates summary */}
      {selectedStartDate && (
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Ngày nhận xe:</span>
              <span>{selectedStartDate.toLocaleDateString('vi-VN')}</span>
            </div>
            {selectedEndDate && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-medium">Ngày trả xe:</span>
                <span>{selectedEndDate.toLocaleDateString('vi-VN')}</span>
              </div>
            )}
          </div>
          {selectedEndDate && (
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">
                {getTotalNights()} ngày
              </p>
            </div>
          )}
          {!selectedEndDate && (
            <p className="text-sm text-gray-600 text-center">
              Chọn ngày trả xe để hoàn tất
            </p>
          )}
        </div>
      )}

      {/* Instructions */}
      {!selectedStartDate && (
        <div className="text-sm text-gray-600 text-center bg-blue-50 rounded-lg p-3">
          💡 Chọn ngày nhận xe để bắt đầu
        </div>
      )}
    </div>
  );
}
