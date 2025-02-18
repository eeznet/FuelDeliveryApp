import React from 'react';
import { 
    Document, 
    Page, 
    Text, 
    View, 
    StyleSheet 
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica'
    },
    header: {
        marginBottom: 30,
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        marginBottom: 10
    },
    table: {
        display: 'table',
        width: '100%',
        marginBottom: 20
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid'
    },
    tableCell: {
        padding: 5,
        flex: 1
    }
});

const InvoicePDF = ({ invoice }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Fuel Delivery Invoice</Text>
                <Text>Invoice #{invoice.id}</Text>
                <Text>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
            </View>

            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Description</Text>
                    <Text style={styles.tableCell}>Quantity</Text>
                    <Text style={styles.tableCell}>Price</Text>
                    <Text style={styles.tableCell}>Total</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{invoice.fuelType}</Text>
                    <Text style={styles.tableCell}>{invoice.liters} L</Text>
                    <Text style={styles.tableCell}>${invoice.pricePerLiter}</Text>
                    <Text style={styles.tableCell}>${invoice.total}</Text>
                </View>
            </View>

            <View>
                <Text>Total Amount: ${invoice.total}</Text>
                <Text>Payment Status: {invoice.status}</Text>
            </View>
        </Page>
    </Document>
);

export default InvoicePDF; 