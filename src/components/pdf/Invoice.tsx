import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkEntry, FreelanceSettings } from '../../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  info: {
    fontSize: 10,
    marginBottom: 5,
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
  settings: FreelanceSettings;
  totalAmount: number;
}

export function Invoice({ entries, month, settings, totalAmount }: Props) {
  const invoiceNumber = `${format(month, 'yyyyMM')}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.info}>{settings.fullName}</Text>
          <Text style={styles.info}>{settings.address}</Text>
          <Text style={styles.info}>SIRET: {settings.siret}</Text>
        </View>

        <Text style={styles.title}>
          Facture N° {invoiceNumber}
        </Text>

        <Text style={styles.info}>
          Date: {format(new Date(), 'dd/MM/yyyy', { locale: fr })}
        </Text>
        <Text style={styles.info}>
          Période: {format(month, 'MMMM yyyy', { locale: fr })}
        </Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Quantité</Text>
            <Text style={styles.tableCell}>Prix unitaire</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>

          {entries
            .filter((entry) => entry.type === 'daily' && entry.amount > 0)
            .length > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Prestation journalière</Text>
              <Text style={styles.tableCell}>
                {entries
                  .filter((entry) => entry.type === 'daily')
                  .reduce((sum, entry) => sum + entry.amount, 0)}
              </Text>
              <Text style={styles.tableCell}>
                {settings.dailyRate?.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: settings.currency,
                })}
              </Text>
              <Text style={styles.tableCell}>
                {(
                  entries
                    .filter((entry) => entry.type === 'daily')
                    .reduce((sum, entry) => sum + entry.amount, 0) * (settings.dailyRate || 0)
                ).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: settings.currency,
                })}
              </Text>
            </View>
          )}

          {entries
            .filter((entry) => entry.type === 'hourly' && entry.amount > 0)
            .length > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Prestation horaire</Text>
              <Text style={styles.tableCell}>
                {entries
                  .filter((entry) => entry.type === 'hourly')
                  .reduce((sum, entry) => sum + entry.amount, 0)}
              </Text>
              <Text style={styles.tableCell}>
                {settings.hourlyRate?.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: settings.currency,
                })}
              </Text>
              <Text style={styles.tableCell}>
                {(
                  entries
                    .filter((entry) => entry.type === 'hourly')
                    .reduce((sum, entry) => sum + entry.amount, 0) * (settings.hourlyRate || 0)
                ).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: settings.currency,
                })}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.total}>
          Total: {totalAmount.toLocaleString('fr-FR', {
            style: 'currency',
            currency: settings.currency,
          })}
        </Text>

        <Text style={[styles.info, { marginTop: 40 }]}>
          TVA non applicable, art. 293 B du CGI
        </Text>
      </Page>
    </Document>
  );
}