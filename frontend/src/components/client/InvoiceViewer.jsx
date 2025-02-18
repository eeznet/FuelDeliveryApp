import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Box
} from '@mui/material';
import { 
    Download as DownloadIcon,
    Print as PrintIcon 
} from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const InvoiceViewer = ({ invoice, open, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Invoice #{invoice?.id}</Typography>
                    <Box>
                        <PDFDownloadLink 
                            document={<InvoicePDF invoice={invoice} />}
                            fileName={`invoice-${invoice?.id}.pdf`}
                        >
                            <Button startIcon={<DownloadIcon />}>
                                Download
                            </Button>
                        </PDFDownloadLink>
                        <Button 
                            startIcon={<PrintIcon />} 
                            onClick={handlePrint}
                        >
                            Print
                        </Button>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent>
                {/* Invoice Details */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{invoice?.fuelType}</TableCell>
                            <TableCell>{invoice?.liters} L</TableCell>
                            <TableCell>${invoice?.pricePerLiter}</TableCell>
                            <TableCell>${invoice?.total}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceViewer; 