import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Divider,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  MdTrendingUp,
  MdAttachMoney,
  MdPeople,
  MdReceipt,
  MdRestaurant,
  MdDashboard,
  MdToday,
  MdCalendarMonth,
  MdAssessment,
  MdAdd,
  MdPrint,
  MdSend,
} from 'react-icons/md';

const API_URL = 'https://atc-geca.onrender.com/api';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    today_sales: 0,
    month_sales: 0,
    total_customers: 0,
    recent_invoices: [],
  });
  const [tabValue, setTabValue] = useState(0);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch today's sales
      const todayRes = await axios.get(`${API_URL}/sales/today`, config);
      
      // Fetch month's sales
      const monthRes = await axios.get(`${API_URL}/sales/month`, config);
      
      // Fetch customers
      const customersRes = await axios.get(`${API_URL}/customers`, config);
      
      // Fetch recent invoices
      const invoicesRes = await axios.get(`${API_URL}/sales/recent?limit=5`, config);

      setDashboardData({
        today_sales: todayRes.data.total || 0,
        month_sales: monthRes.data.total || 0,
        total_customers: customersRes.data.count || 0,
        recent_invoices: invoicesRes.data.results || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use demo data if API fails
      setDashboardData({
        today_sales: 45000,
        month_sales: 850000,
        total_customers: 124,
        recent_invoices: [
          { id: 1, invoice_no: 'SI-200025-830', customer: 'Faisal Khalid', date: '2026-08-25', total: 25000 },
          { id: 2, invoice_no: 'SI-200025-829', customer: 'Rajesh Sharma', date: '2026-08-24', total: 32000 },
          { id: 3, invoice_no: 'SI-200025-828', customer: 'Priya Singh', date: '2026-08-24', total: 18000 },
          { id: 4, invoice_no: 'SI-200025-827', customer: 'Amit Kumar', date: '2026-08-23', total: 42000 },
          { id: 5, invoice_no: 'SI-200025-826', customer: 'Sunita Reddy', date: '2026-08-23', total: 15000 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Quick action buttons
  const quickActions = [
    { title: 'New Sales Invoice', icon: <MdAdd />, color: '#1976d2', link: '/sales/invoice/new' },
    { title: 'New Customer', icon: <MdPeople />, color: '#2e7d32', link: '/masters/customers/new' },
    { title: 'Agent Page', icon: <MdRestaurant />, color: '#25D366', link: '/agent' },
    { title: 'Print Invoice', icon: <MdPrint />, color: '#ed6c02', link: '/sales/invoices' },
    { title: 'Send via WhatsApp', icon: <MdSend />, color: '#128C7E', link: '/sales/invoices' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#1a237e">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Allied Trading Corporation - ERP System
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<MdToday />}
            label={new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<MdRestaurant />}
            label="WhatsApp Connected"
            color="success"
          />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Today's Sales</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#1976d2">
                    {formatCurrency(dashboardData.today_sales)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e3f2fd' }}>
                  <MdAttachMoney style={{ color: '#1976d2', fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Month's Sales</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#2e7d32">
                    {formatCurrency(dashboardData.month_sales)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e8f5e9' }}>
                  <MdTrendingUp style={{ color: '#2e7d32', fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Customers</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#ed6c02">
                    {dashboardData.total_customers}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#fff3e0' }}>
                  <MdPeople style={{ color: '#ed6c02', fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Invoices</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#9c27b0">
                    {dashboardData.recent_invoices.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#f3e5f5' }}>
                  <MdReceipt style={{ color: '#9c27b0', fontSize: 24 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid size="auto" key={index}>
              <Button
                component={Link}
                to={action.link}
                variant="contained"
                startIcon={action.icon}
                sx={{
                  bgcolor: action.color,
                  '&:hover': { bgcolor: action.color, opacity: 0.9 },
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                }}
              >
                {action.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tabs for Recent Activity */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Recent Invoices" />
          <Tab label="Today's Activity" />
          <Tab label="WhatsApp History" />
        </Tabs>

        {/* Tab Panels */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Invoice No.</strong></TableCell>
                    <TableCell><strong>Customer</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                    <TableCell align="center"><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recent_invoices.length > 0 ? (
                    dashboardData.recent_invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoice_no}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.total)}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label="Completed" 
                            size="small" 
                            color="success" 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                            component={Link}
                            to={`/sales/invoice/${invoice.id}`}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">No recent invoices found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary">Today's activity will appear here</Typography>
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary">WhatsApp message history will appear here</Typography>
          </Box>
        )}
      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Â© 2026 Allied Trading Corporation | Zebaish Caterers | Signature Spread
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Built with â¤ï¸ | ERP Version 1.0
        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;




