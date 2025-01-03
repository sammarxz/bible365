import { useMemo } from "react";
import {
  startOfYear,
  eachDayOfInterval,
  addDays,
  format,
  getDayOfYear,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface HeatMapProps {
  completedDates: string[];
  baseColor?: string;
  completedColor?: string;
}

export function HeatmapCalendar({
  completedDates,
  baseColor = "#E5E6E6",
  completedColor = "#4ade80",
}: HeatMapProps) {
  const TOTAL_WEEKS = 30;
  const DAYS_PER_WEEK = 7;
  const DAY_LABELS = ["D", "", "T", "", "Q", "", "S"];

  const CELL_BASE = 14;
  const PADDING = 2;
  const CELL_SIZE = CELL_BASE - PADDING;
  const TOTAL_WIDTH = TOTAL_WEEKS * CELL_BASE + 20;
  const TOTAL_HEIGHT = DAYS_PER_WEEK * CELL_BASE + 20;

  const cells = useMemo(() => {
    const grid = [];
    const startDate = startOfYear(new Date());
    const daysOfYear = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, TOTAL_WEEKS * 7),
    });

    for (let i = 0; i < daysOfYear.length; i++) {
      const currentDate = daysOfYear[i];
      const dateString = format(currentDate, "yyyy-MM-dd");

      grid.push({
        x: Math.floor(i / 7) * CELL_BASE + 20,
        y: currentDate.getDay() * CELL_BASE + 15,
        date: dateString,
        completed: completedDates.includes(dateString),
      });
    }

    return grid;
  }, [completedDates]);

  const monthPositions = useMemo(() => {
    const months = eachDayOfInterval({
      start: startOfYear(new Date()),
      end: addDays(startOfYear(new Date()), TOTAL_WEEKS * 7),
    }).filter((date) => date.getDate() === 1);

    return months.map((date) => ({
      label: format(date, "MMM", { locale: ptBR }).toUpperCase(),
      x: Math.floor(getDayOfYear(date) / 7) * CELL_BASE + 20,
    }));
  }, []);

  return (
    <svg
      viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}
      width="100%"
      height={TOTAL_HEIGHT}
      style={{ display: "block" }}
    >
      {/* Month labels */}
      {monthPositions.map((month, i) => (
        <text
          key={`month-${i}`}
          x={month.x}
          y="8"
          textAnchor="middle"
          fontSize="10"
          fill="#aaa"
        >
          {month.label}
        </text>
      ))}

      {/* Day labels */}
      {DAY_LABELS.map((day, i) => (
        <text
          key={`day-${i}`}
          x="10"
          y={i * CELL_BASE + 21}
          textAnchor="middle"
          fontSize="9"
          fill="#aaa"
        >
          {day}
        </text>
      ))}

      {/* Grid cells */}
      {cells.map((cell, i) => (
        <rect
          key={`cell-${i}`}
          x={cell.x}
          y={cell.y}
          width={CELL_SIZE}
          height={CELL_SIZE}
          rx="2"
          ry="2"
          fill={cell.completed ? `${completedColor}` : `${baseColor}50`}
        />
      ))}
    </svg>
  );
}
