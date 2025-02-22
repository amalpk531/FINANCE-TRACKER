import React, { useEffect, useState } from "react";
import { 
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Add, FormatListBulleted, BarChart } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { useNavigate } from "react-router-dom";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [cUser, setcUser] = useState(null);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  // Keep all your existing logic and state management
  // ... [Keep all the useEffect hooks, handle functions, and API calls from your original code]

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Frequency Selector */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={frequency}
                  onChange={handleChangeFrequency}
                  label="Frequency"
                >
                  <MenuItem value="7">Last Week</MenuItem>
                  <MenuItem value="30">Last Month</MenuItem>
                  <MenuItem value="365">Last Year</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Type Selector */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={handleSetType}
                  label="Type"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="credit">Income</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* View Toggle */}
            <Grid item xs={6} md={3} sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={handleTableClick}
                color={view === 'table' ? 'primary' : 'default'}
                sx={{ 
                  border: view === 'table' ? '1px solid' + theme.palette.primary.main : '1px solid #ddd',
                  borderRadius: 1
                }}
              >
                <FormatListBulleted />
              </IconButton>
              <IconButton
                onClick={handleChartClick}
                color={view === 'chart' ? 'primary' : 'default'}
                sx={{ 
                  border: view === 'chart' ? '1px solid' + theme.palette.primary.main : '1px solid #ddd',
                  borderRadius: 1
                }}
              >
                <BarChart />
              </IconButton>
            </Grid>

            {/* Add Transaction Button */}
            <Grid item xs={6} md={3} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleShow}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                Add New
              </Button>
              <IconButton
                color="primary"
                onClick={handleShow}
                sx={{ 
                  display: { md: 'none' },
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': { bgcolor: theme.palette.primary.dark }
                }}
              >
                <Add />
              </IconButton>
            </Grid>
          </Grid>

          {/* Custom Date Pickers */}
          {frequency === "custom" && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartChange}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={handleEndChange}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                  minDate={startDate}
                />
              </Grid>
            </Grid>
          )}
        </Paper>

        {/* Reset Filter Button */}
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ mb: 3 }}
        >
          Reset Filters
        </Button>

        {/* Content Area */}
        <Paper elevation={3} sx={{ p: 3 }}>
          {loading ? (
            <Spinner />
          ) : view === "table" ? (
            <TableData data={transactions} user={cUser} />
          ) : (
            <Analytics transactions={transactions} user={cUser} />
          )}
        </Paper>

        {/* Add Transaction Dialog */}
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={values.amount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={values.date}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="Groceries">Groceries</MenuItem>
                    <MenuItem value="Rent">Rent</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Tip">Tip</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Medical">Medical</MenuItem>
                    <MenuItem value="Utilities">Utilities</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                    <MenuItem value="Transportation">Transportation</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="transactionType"
                    value={values.transactionType}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="credit">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save Transaction
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Home;