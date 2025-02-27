import "./home.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light", // Changed to light theme
  };
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

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, description, category, date, transactionType } =
      values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }
    setLoading(true);

    const { data } = await axios.post(addTransaction, {
      title: title,
      amount: amount,
      description: description,
      category: category,
      date: date,
      transactionType: transactionType,
      userId: cUser._id,
    });

    if (data.success === true) {
      toast.success(data.message, toastOptions);
      handleClose();
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        if (!cUser || !cUser._id) return;
        
        setLoading(true);
        console.log(cUser._id, frequency, startDate, endDate, type);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency: frequency,
          startDate: startDate,
          endDate: endDate,
          type: type,
        });
        console.log(data);
  
        setTransactions(data.transactions);
  
        setLoading(false);
      } catch (err) {
        // toast.error("Error please Try again...", toastOptions);
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, cUser]);

  const handleTableClick = () => {
    setView("table");
  };

  const handleChartClick = () => {
    setView("chart");
  };

  return (
    <>
      <Header />

      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-4 py-3 bg-light rounded shadow-sm">
          <Row className="align-items-end mb-4">
            <Col md={3} sm={6} className="mb-3 mb-md-0">
              <Form.Group controlId="formSelectFrequency">
                <Form.Label className="fw-bold">Time Period</Form.Label>
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

            <Col md={3} sm={6} className="mb-3 mb-md-0">
              <Form.Group controlId="formSelectType">
                <Form.Label className="fw-bold">Transaction Type</Form.Label>
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

            <Col md={3} sm={6} className="d-flex align-items-center mb-3 mb-md-0">
              <div className="d-flex gap-3 align-items-center">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleReset}
                  className="px-3 py-2"
                >
                  Reset Filters
                </Button>
                
                <div className="d-flex align-items-center border rounded p-1 ms-2">
                  <FormatListBulletedIcon
                    sx={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={handleTableClick}
                    className={`p-1 rounded ${
                      view === "table" ? "bg-primary text-white" : "text-secondary"
                    }`}
                  />
                  <BarChartIcon
                    sx={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={handleChartClick}
                    className={`p-1 rounded ${
                      view === "chart" ? "bg-primary text-white" : "text-secondary"
                    }`}
                  />
                </div>
              </div>
            </Col>

            <Col md={3} sm={6} className="text-md-end">
              <Button 
                onClick={handleShow} 
                variant="primary" 
                className="addNew px-3 py-2"
              >
                Add Transaction
              </Button>
              <Button 
                onClick={handleShow} 
                variant="primary" 
                className="mobileBtn d-md-none"
              >
                +
              </Button>
            </Col>
          </Row>

          {frequency === "custom" && (
            <Row className="mb-4">
              <Col sm={6} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Start Date</Form.Label>
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="form-control border"
                  />
                </Form.Group>
              </Col>
              <Col sm={6} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">End Date</Form.Label>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="form-control border"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <div className="bg-white p-3 rounded shadow-sm">
            {view === "table" ? (
              <TableData data={transactions} user={cUser} />
            ) : (
              <Analytics transactions={transactions} user={cUser} />
            )}
          </div>
                
          {/* Transaction Modal */}
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-light">
              <Modal.Title>Add Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label className="fw-bold">Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="text"
                    placeholder="Enter transaction name"
                    value={values.title}
                    onChange={handleChange}
                    className="border"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAmount">
                  <Form.Label className="fw-bold">Amount</Form.Label>
                  <Form.Control
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={values.amount}
                    onChange={handleChange}
                    className="border"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formSelect">
                      <Form.Label className="fw-bold">Category</Form.Label>
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
                      <Form.Label className="fw-bold">Transaction Type</Form.Label>
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
                  <Form.Label className="fw-bold">Description</Form.Label>
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
                  <Form.Label className="fw-bold">Date</Form.Label>
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
            <Modal.Footer className="bg-light">
              <Button variant="outline-secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Add Transaction
              </Button>
            </Modal.Footer>
          </Modal>
          
          <ToastContainer />
        </Container>
      )}
    </>
  );
};

export default Home;