"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Event from "./Event";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScheduleProps {
  events: CalendarEvent[];
  currentDate?: Date;
  className?: string;
}

interface TimeBreakdown {
  lecture: number;
  laboratory: number;
  tutorial: number;
  seminar: number;
}

export default function Schedule({
  events,
  currentDate = new Date(),
  className,
}: ScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleEventClick = (event: CalendarEvent) => {
    console.log("Event clicked:", event);
  };

  const handleDateChange = (date: Date) => {
    console.log("Date changed:", date);
  };

  // Calendar navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
    handleDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
    handleDateChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    handleDateChange(today);
  };

  // Get week dates
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, [selectedDate]);

  // Time slots (24 hours in 12-hour format)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour < 12 ? "AM" : "PM";
      slots.push(`${hour12} ${period}`);
    }
    return slots;
  }, []);

  // Filter events for current week
  const weekEvents = useMemo(() => {
    const startOfWeek = weekDates[0];
    const endOfWeek = new Date(weekDates[6]);
    endOfWeek.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      return eventStart >= startOfWeek && eventStart <= endOfWeek;
    });
  }, [events, weekDates]);

  // Calculate time breakdown
  const timeBreakdown = useMemo(() => {
    const breakdown: TimeBreakdown = {
      lecture: 0,
      laboratory: 0,
      tutorial: 0,
      seminar: 0,
    };

    weekEvents.forEach((event) => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);
      const duration =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const component = event.course.instructionalComponents;
      if (component) {
        breakdown[component] += duration;
      }
    });

    return breakdown;
  }, [weekEvents]);

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return weekEvents.filter((event) => {
      const eventStart = new Date(event.startTime);
      return eventStart >= dayStart && eventStart <= dayEnd;
    });
  };

  // Calculate event position and height
  const getEventStyle = (event: CalendarEvent, dayDate: Date) => {
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);

    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    const startPosition = (startHour + startMinute / 60) * 60; // 60px per hour
    const duration =
      (endHour + endMinute / 60 - (startHour + startMinute / 60)) * 60;

    return {
      top: `${startPosition}px`,
      height: `${Math.max(duration, 30)}px`, // Minimum height of 30px
      zIndex: 10,
    };
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatDay = (date: Date) => {
    return date.getDate().toString();
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const upcomingEvents = weekEvents
    .filter((event) => new Date(event.startTime) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .slice(0, 3);

  return (
    <div className={cn("flex gap-6 h-full", className)}>
      {/* Main Calendar */}
      <div className="flex-1 min-w-0">
        <div className="h-full">
          <div className=" py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="font-semibold text-lg">
                  {formatMonth(selectedDate)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="ghost" size="sm" onClick={goToNextWeek}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex h-[40rem] overflow-auto">
            {/* Time column */}
            <div className="w-16 flex-shrink-0 relative">
              <div className="h-16 bg-background sticky top-0 z-30"></div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-[60px] text-xs font-medium px-2 py-1 flex items-start justify-end"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Days columns */}
            <div className="flex-1 grid grid-cols-7 min-w-0">
              {weekDates.map((date, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "border-l last:border-r relative",
                    isToday(date) && "bg-muted/50"
                  )}
                >
                  {/* Day header */}
                  <div
                    className={cn(
                      "h-16 border-b flex flex-col justify-center px-4 sticky top-0 z-30 bg-background",
                      isToday(date) && "bg-primary text-primary-foreground"
                    )}
                  >
                    <div className="text-xs font-medium uppercase">
                      {formatDayName(date)}
                    </div>
                    <div
                      className={cn(
                        "text-xl font-semibold",
                        isToday(date)
                          ? "text-primary-foreground"
                          : "text-foreground"
                      )}
                    >
                      {formatDay(date)}
                    </div>
                  </div>

                  {/* Day content */}
                  <div className="relative min-h-[1440px] overflow-auto">
                    {/* Time slots */}
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="h-[60px] border-b relative group"
                      ></div>
                    ))}

                    {/* Events */}
                    {getEventsForDay(date).map((event) => (
                      <Event
                        key={event.id}
                        event={event}
                        onClick={handleEventClick}
                        style={getEventStyle(event, date)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
