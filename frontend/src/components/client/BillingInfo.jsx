import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip
} from '@mui/material';
import {
    AccountBalance as BankIcon,
    CreditCard as CardIcon,
    Receipt as ReceiptIcon
} from '@mui/icons-material';

const BillingInfo = ({ billingData }) => {
    return (
        <Grid container spacing={3}>
            {/* Payment Methods */}
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Payment Methods
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        {billingData.paymentMethods?.map((method) => (
                            <Box
                                key={method.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    mb: 2,
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1
                                }}
                            >
                                {method.type === 'bank' ? <BankIcon /> : <CardIcon />}
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="subtitle2">
                                        {method.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {method.type === 'bank' 
                                            ? `****${method.accountNumber.slice(-4)}`
                                            : `****${method.cardNumber.slice(-4)}`
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        <Button variant="outlined" fullWidth>
                            Add Payment Method
                        </Button>
                    </Box>
                </Paper>
            </Grid>

            {/* Billing Summary */}
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Recent Invoices
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Invoice #</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billingData.invoices?.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>{invoice.number}</TableCell>
                                        <TableCell>
                                            {new Date(invoice.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={invoice.status}
                                                color={invoice.status === 'paid' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                startIcon={<ReceiptIcon />}
                                                size="small"
                                            >
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            {/* Billing Stats */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" gutterBottom>
                                Total Spent (This Month)
                            </Typography>
                            <Typography variant="h4">
                                ${billingData.monthlyTotal?.toFixed(2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" gutterBottom>
                                Outstanding Balance
                            </Typography>
                            <Typography variant="h4" color="error">
                                ${billingData.outstandingBalance?.toFixed(2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" gutterBottom>
                                Available Credit
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                ${billingData.availableCredit?.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default BillingInfo; 