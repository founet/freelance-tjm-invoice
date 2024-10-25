import React from 'react';
import { useStore } from '../store/useStore';
import { WorkEntry } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function TimeTracking() {
  const { entries, addEntry, removeEntry } = useStore();
  const [selectedMonth, setSelectedMonth] = React.useState(() => format(new Date(), 'yyyy-MM'));
  const [type, setType] = React.useState<'daily' | 'hourly'>('daily');

  const monthStart = startOfMonth(new Date(selectedMonth));
  const monthEnd = endOfMonth(new Date(selectedMonth));
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntryForDate = (date: Date) => {
    return entries.find(
      (entry) =>
        entry.type === type &&
        format(new Date(entry.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleDailyEntryChange = (date: Date, amount: number) => {
    const existingEntry = getEntryForDate(date);
    if (existingEntry) {
      if (amount === 0) {
        removeEntry(existingEntry.id);
      } else {
        removeEntry(existingEntry.id);
        addEntry({
          id: Date.now().toString(),
          date,
          type: 'daily',
          amount,
        });
      }
    } else if (amount > 0) {
      addEntry({
        id: Date.now().toString(),
        date,
        type: 'daily',
        amount,
      });
    }
  };

  const handleHourlyEntryChange = (date: Date, hours: number) => {
    const existingEntry = getEntryForDate(date);
    if (existingEntry) {
      if (hours === 0) {
        removeEntry(existingEntry.id);
      } else {
        removeEntry(existingEntry.id);
        addEntry({
          id: Date.now().toString(),
          date,
          type: 'hourly',
          amount: hours,
        });
      }
    } else if (hours > 0) {
      addEntry({
        id: Date.now().toString(),
        date,
        type: 'hourly',
        amount: hours,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium text-gray-900">Saisie du temps</h2>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'daily' | 'hourly')}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="daily">Journalier (TJM)</option>
              <option value="hourly">Horaire</option>
            </select>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              return (
                <option key={i} value={format(date, 'yyyy-MM')}>
                  {format(date, 'MMMM yyyy', { locale: fr })}
                </option>
              );
            })}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {type === 'daily' ? 'Type de journée' : 'Heures travaillées'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {daysInMonth.map((date) => {
                const entry = getEntryForDate(date);
                const isWeekendDay = isWeekend(date);

                return (
                  <tr 
                    key={format(date, 'yyyy-MM-dd')}
                    className={isWeekendDay ? 'bg-gray-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className={isWeekendDay ? 'text-gray-500' : ''}>
                          {format(date, 'EEEE dd MMMM', { locale: fr })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {type === 'daily' ? (
                        <select
                          value={entry?.amount || 0}
                          onChange={(e) => handleDailyEntryChange(date, Number(e.target.value))}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          disabled={isWeekendDay}
                        >
                          <option value={0}>Pas travaillé</option>
                          <option value={0.5}>Demi-journée</option>
                          <option value={1}>Journée complète</option>
                        </select>
                      ) : (
                        <select
                          value={entry?.amount || 0}
                          onChange={(e) => handleHourlyEntryChange(date, Number(e.target.value))}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          disabled={isWeekendDay}
                        >
                          {Array.from({ length: 13 }, (_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? 'Pas travaillé' : `${i} heure${i > 1 ? 's' : ''}`}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}