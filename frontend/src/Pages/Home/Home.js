import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

// Components
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { Button, Modal, Form, Container, Row, Col, Card } from "react-bootstrap";

// Icons
import { FaTable, FaChartBar, FaPlus, FaFilter, FaUndo } from "react-icons/fa";

// API endpoints
import { addTransaction, getTransactions } from "../../utils/ApiRequest";

const Home = () => {
  const navigate = useNavigate();

  // Toast configuration
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  // State management
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [showFilters, setShowFilters] = useState(false);
  const [transactionCounts, setTransactionCounts] = useState({
    total: 0,
    income: 0,
    expense: 0
  });

  // Form values
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
    transactionType: "",
  });

  // Modal handlers
  const handleClose = () => {
    setValues({
      title: "",
      amount: "",
      description: "",
      category: "",
      date: format(new Date(), "yyyy-MM-dd"),
      transactionType: "",
    });
    setShow(false);
  };
  
  const handleShow = () => setShow(true);

  // Check user authentication
  useEffect(() => {
    const checkUserAuth = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    checkUserAuth();
  }, [navigate]);

  // Form change handlers
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
    if (e.target.value !== "custom") {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  // Reset filters
  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  // View toggle handlers
  const handleTableClick = () => {
    setView("table");
  };

  const handleChartClick = () => {
    setView("chart");
  };

  // Add transaction form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, description, category, date, transactionType } = values;

    if (!title || !amount || !description || !category || !date || !transactionType) {
      toast.error("Please fill in all the fields", toastOptions);
      return;
    }
    
    setLoading(true);

    try {
      const { data } = await axios.post(addTransaction, {
        title,
        amount,
        description,
        category,
        date,
        transactionType,
        userId: cUser._id,
      });

      if (data.success === true) {
        toast.success(data.message, toastOptions);
        handleClose();
        setRefresh(!refresh);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions
  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        if (!cUser || !cUser._id) return;
        
        setLoading(true);
        
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency,
          startDate,
          endDate,
          type,
        });

        setTransactions(data.transactions);
        
        // Calculate counts
        const counts = {
          total: data.transactions.length,
          income: data.transactions.filter(t => t.transactionType === 'credit').length,
          expense: data.transactions.filter(t => t.transactionType === 'expense').length
        };
        setTransactionCounts(counts);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        toast.error("Error loading transactions. Please try again.", toastOptions);
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, cUser]);

  // Calculate summary stats
  const calculateSummary = () => {
    if (!transactions.length) return { income: 0, expense: 0, balance: 0 };
    
    const income = transactions
      .filter(t => t.transactionType === 'credit')
      .reduce((acc, t) => acc + Number(t.amount), 0);
      
    const expense = transactions
      .filter(t => t.transactionType === 'expense')
      .reduce((acc, t) => acc + Number(t.amount), 0);
      
    return {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      balance: (income - expense).toFixed(2)
    };
  };

  const summary = calculateSummary();

  return (
    <>
      <Header />

      {loading && <Spinner />}
      
      <Container className="py-4">
        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between">
                  <Card.Title className="fs-6 text-muted">Income</Card.Title>
                  <div className="bg-success bg-opacity-10 rounded-circle p-2">
                    <FaPlus className="text-success" />
                  </div>
                </div>
                <h3 className="mt-3 text-success">₹{summary.income}</h3>
                <div className="mt-2 text-muted small">
                  {transactionCounts.income} transactions
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between">
                  <Card.Title className="fs-6 text-muted">Expenses</Card.Title>
                  <div className="bg-danger bg-opacity-10 rounded-circle p-2">
                    <FaPlus className="text-danger" style={{ transform: 'rotate(45deg)' }} />
                  </div>
                </div>
                <h3 className="mt-3 text-danger">₹{summary.expense}</h3>
                <div className="mt-2 text-muted small">
                  {transactionCounts.expense} transactions
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between">
                  <Card.Title className="fs-6 text-muted">Balance</Card.Title>
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className={`mt-3 ${Number(summary.balance) >= 0 ? 'text-primary' : 'text-danger'}`}>
                ₹{summary.balance}
                </h3>
                <div className="mt-2 text-muted small">
                  {transactionCounts.total} total transactions
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Action Bar */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={6} md={3} className="mb-3 mb-md-0">
                <Button 
                  variant="primary" 
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleShow}
                >
                  <FaPlus size={14} />
                  <span className="d-none d-sm-inline">Add Transaction</span>
                  <span className="d-inline d-sm-none">Add</span>
                </Button>
              </Col>
              
              <Col xs={6} md={3} className="mb-3 mb-md-0">
                <Button 
                  variant="outline-secondary" 
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter size={14} />
                  <span className="d-none d-sm-inline">
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </span>
                  <span className="d-inline d-sm-none">Filter</span>
                </Button>
              </Col>
              
              <Col xs={12} md={6} className="d-flex justify-content-end">
                <div className="btn-group">
                  <Button 
                    variant={view === "table" ? "primary" : "outline-primary"}
                    onClick={handleTableClick}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaTable size={14} />
                    <span className="d-none d-md-inline">Table</span>
                  </Button>
                  <Button 
                    variant={view === "chart" ? "primary" : "outline-primary"}
                    onClick={handleChartClick}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaChartBar size={14} />
                    <span className="d-none d-md-inline">Analytics</span>
                  </Button>
                </div>
              </Col>
            </Row>
            
            {/* Filters Section */}
            {showFilters && (
              <div className="mt-4 pt-3 border-top">
                <Row className="align-items-end">
                  <Col md={3} sm={6} className="mb-3">
                    <Form.Group controlId="formSelectFrequency">
                      <Form.Label className="fw-bold small">Time Period</Form.Label>
                      <Form.Select
                        name="frequency"
                        value={frequency}
                        onChange={handleChangeFrequency}
                        className="border"
                      >
                        <option value="7">Last Week</option>
                        <option value="30">Last Month</option>
                        <option value="365">Last Year</option>
                        <option value="custom">Custom Range</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3} sm={6} className="mb-3">
                    <Form.Group controlId="formSelectType">
                      <Form.Label className="fw-bold small">Transaction Type</Form.Label>
                      <Form.Select
                        name="type"
                        value={type}
                        onChange={handleSetType}
                        className="border"
                      >
                        <option value="all">All Transactions</option>
                        <option value="expense">Expenses Only</option>
                        <option value="credit">Income Only</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {frequency === "custom" && (
                    <>
                      <Col md={3} sm={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold small">Start Date</Form.Label>
                          <DatePicker
                            selected={startDate}
                            onChange={handleStartChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className="form-control border"
                            placeholderText="Select start date"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3} sm={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold small">End Date</Form.Label>
                          <DatePicker
                            selected={endDate}
                            onChange={handleEndChange}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="form-control border"
                            placeholderText="Select end date"
                          />
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  <Col md={frequency === "custom" ? 12 : 6} className="mb-3 d-flex justify-content-end">
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleReset}
                      className="d-flex align-items-center gap-2"
                    >
                      <FaUndo size={14} />
                      <span>Reset Filters</span>
                    </Button>
                  </Col>
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-sm">
          <Card.Body className={transactions.length === 0 ? "text-center py-5" : ""}>
            {transactions.length === 0 ? (
              <div className="py-5">
                <div className="text-muted mb-3">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h5>No Transactions Found</h5>
                <p className="text-muted">Add a new transaction or adjust your filters</p>
                <Button 
                  variant="primary" 
                  onClick={handleShow}
                  className="mt-2"
                >
                  Add Your First Transaction
                </Button>
              </div>
            ) : (
              view === "table" ? (
                <TableData data={transactions} user={cUser} />
              ) : (
                <Analytics transactions={transactions} user={cUser} />
              )
            )}
          </Card.Body>
        </Card>
                
        {/* Transaction Modal */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title>Add Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label className="fw-bold small">Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="text"
                      placeholder="Enter transaction name"
                      value={values.title}
                      onChange={handleChange}
                      className="border"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3" controlId="formAmount">
                    <Form.Label className="fw-bold small">Amount</Form.Label>
                    <Form.Control
                      name="amount"
                      type="number"
                      placeholder="0.00"
                      value={values.amount}
                      onChange={handleChange}
                      className="border"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formSelect">
                    <Form.Label className="fw-bold small">Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      className="border"
                    >
                      <option value="">Choose...</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Rent">Rent</option>
                      <option value="Salary">Salary</option>
                      <option value="Tip">Tip</option>
                      <option value="Food">Food</option>
                      <option value="Medical">Medical</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formSelect1">
                    <Form.Label className="fw-bold small">Transaction Type</Form.Label>
                    <Form.Select
                      name="transactionType"
                      value={values.transactionType}
                      onChange={handleChange}
                      className="border"
                    >
                      <option value="">Choose...</option>
                      <option value="credit">Income (Credit)</option>
                      <option value="expense">Expense (Debit)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label className="fw-bold small">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  placeholder="Enter description"
                  value={values.description}
                  onChange={handleChange}
                  className="border"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDate">
                <Form.Label className="fw-bold small">Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  className="border"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </Modal.Footer>
        </Modal>
        
        <ToastContainer />
      </Container>
    </>
  );
};

export default Home;