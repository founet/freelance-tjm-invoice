import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkEntry } from '../../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  total: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'right',
  },
});

interface Props {
  entries: WorkEntry[];
  month: Date;
}

export function ActivityReport({ entries, month }: Props) {
  const totalDays = entries
    .filter((entry) => entry.type === 'daily')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalHours = entries
    .filter((entry) => entry.type === 'hourly')
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Rapport d'activité - {format(month, 'MMMM yyyy', { locale: fr })}
        </Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Type</Text>
            <Text style={styles.tableCell}>Quantité</Text>
          </View>

          {entries
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((entry, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {format(new Date(entry.date), 'dd/MM/yyyy')}
                </Text>
                <Text style={styles.tableCell}>
                  {entry.type === 'daily' ? 'Journalier' : 'Horaire'}
                </Text>
                <Text style={styles.tableCell}>
                  {entry.type === 'daily'
                    ? `${entry.amount === 1 ? 'Journée complète' : 'Demi-journée'}`
                    : `${entry.amount} heure${entry.amount > 1 ? 's' : ''}`}
                </Text>
              </View>
            ))}
        </View>

        <Text style={styles.total}>
          Total jours : {totalDays}
          {totalHours > 0 && `\nTotal heures : ${totalHours}`}
        </Text>
      </Page>
    </Document>
  );
}