import React from 'react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Mail } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ActivityReport } from './pdf/ActivityReport';
import { Invoice } from './pdf/Invoice';
import { sendEmail } from '../utils/email';

export default function Reports() {
  const { entries, settings } = useStore();
  const [selectedMonth, setSelectedMonth] = React.useState(() => format(new Date(), 'yyyy-MM'));

  const monthStart = startOfMonth(new Date(selectedMonth));
  const monthEnd = endOfMonth(new Date(selectedMonth));

  const monthEntries = entries.filter((entry) =>
    isWithinInterval(new Date(entry.date), { start: monthStart, end: monthEnd })
  );

  const totalDays = monthEntries
    .filter((entry) => entry.type === 'daily')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalHours = monthEntries
    .filter((entry) => entry.type === 'hourly')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalAmount =
    (totalDays * (settings.dailyRate || 0) + totalHours * (settings.hourlyRate || 0));

  const handleSendEmail = async () => {
    try {
      await sendEmail({
        to: settings.clientEmails,
        subject: `Rapport d'activité - ${format(monthStart, 'MMMM yyyy', { locale: fr })}`,
        attachments: [
          await ActivityReport({ entries: monthEntries, month: monthStart }),
          await Invoice({
            entries: monthEntries,
            month: monthStart,
            settings,
            totalAmount,
          }),
        ],
      });
      alert('Documents envoyés avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'envoi des documents.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Rapport mensuel</h2>
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total jours</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalDays}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total heures</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalHours}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Montant total</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {totalAmount.toLocaleString('fr-FR', {
                style: 'currency',
                currency: settings.currency,
              })}
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <PDFDownloadLink
            document={<ActivityReport entries={monthEntries} month={monthStart} />}
            fileName={`rapport-activite-${format(monthStart, 'yyyy-MM')}.pdf`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="h-5 w-5 mr-2" />
            Télécharger le rapport
          </PDFDownloadLink>

          <PDFDownloadLink
            document={
              <Invoice
                entries={monthEntries}
                month={monthStart}
                settings={settings}
                totalAmount={totalAmount}
              />
            }
            fileName={`facture-${format(monthStart, 'yyyy-MM')}.pdf`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="h-5 w-5 mr-2" />
            Télécharger la facture
          </PDFDownloadLink>

          <button
            onClick={handleSendEmail}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Mail className="h-5 w-5 mr-2" />
            Envoyer par email
          </button>
        </div>
      </div>
    </div>
  );
}