import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2]
}));

const IconButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center"
}));

const StyledIconButton = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState("table");
  const [filters, setFilters] = useState({
    frequency: "7",
    type: "all",
    startDate: null,
    endDate: null
  });
  const [formValues, setFormValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: null,
    transactionType: ""
  });
  const [currentUser, setCurrentUser] = useState(null);

  const categories = [
    "Groceries", "Rent", "Salary", "Tip", "Food", "Medical",
    "Utilities", "Entertainment", "Transportation", "Other"
  ];

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     if (!user || !user.isAvatarImageSet) {
  //       navigate("/setAvatar");
  //       return;
  //     }
  //     setCurrentUser(user);
  //     setRefresh(true);
  //   };
  //   checkUser();
  // }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser?._id) return;
      
      try {
        setLoading(true);
        const { data } = await axios.post(getTransactions, {
          userId: currentUser._id,
          frequency: filters.frequency,
          startDate: filters.startDate,
          endDate: filters.endDate,
          type: filters.type
        });
        setTransactions(data.transactions);
      } catch (error) {
        toast.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser, filters, refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.values(formValues).some(value => !value)) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(addTransaction, {
        ...formValues,
        userId: currentUser._id
      });

      if (data.success) {
        toast.success(data.message);
        setDialogOpen(false);
        setRefresh(!refresh);
        setFormValues({
          title: "",
          amount: "",
          description: "",
          category: "",
          date: null,
          transactionType: ""
        });
      }
    } catch (error) {
      toast.error("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      frequency: "7",
      type: "all",
      startDate: null,
      endDate: null
    });
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <StyledPaper>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={filters.frequency}
                  onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}
                  label="Frequency"
                >
                  <MenuItem value="7">Last Week</MenuItem>
                  <MenuItem value="30">Last Month</MenuItem>
                  <MenuItem value="365">Last Year</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="credit">Income</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <IconButtonGroup>
                <StyledIconButton
                  active={view === "table"}
                  onClick={() => setView("table")}
                >
                  <FormatListBulletedIcon />
                </StyledIconButton>
                <StyledIconButton
                  active={view === "chart"}
                  onClick={() => setView("chart")}
                >
                  <BarChartIcon />
                </StyledIconButton>
              </IconButtonGroup>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setDialogOpen(true)}
                >
                  Add New
                </Button>
              </Box>
            </Grid>
          </Grid>

          {filters.frequency === "custom" && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(date) => setFilters({ ...filters, startDate: date })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(date) => setFilters({ ...filters, endDate: date })}
                    minDate={filters.startDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          )}
        </StyledPaper>

        {view === "table" ? (
          <TableData data={transactions} user={currentUser} />
        ) : (
          <Analytics transactions={transactions} user={currentUser} />
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formValues.title}
                  onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  name="amount"
                  value={formValues.amount}
                  onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formValues.category}
                    onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  name="description"
                  value={formValues.description}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={formValues.transactionType}
                    onChange={(e) => setFormValues({ ...formValues, transactionType: e.target.value })}
                    label="Transaction Type"
                  >
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={formValues.date}
                    onChange={(date) => setFormValues({ ...formValues, date })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <ToastContainer position="bottom-right" theme="light" />
    </>
  );
};

export default Home;