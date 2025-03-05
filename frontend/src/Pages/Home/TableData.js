import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";

const TableData = ({ data, user }) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  // Transaction Categories
  const categories = [
    "Groceries", 
    "Rent", 
    "Salary", 
    "Tip", 
    "Food", 
    "Medical", 
    "Utilities", 
    "Entertainment", 
    "Transportation", 
    "Loan",
    "Other"
  ];

  // Handle edit click
  const handleEditClick = (itemId) => {
    if (data.length > 0) {
      const editTran = data.filter((item) => item._id === itemId);
      setCurrId(itemId);
      setEditingTransaction(editTran);
      handleShow();
      
      // Pre-fill the form with existing transaction data
      setValues({
        title: editTran[0].title,
        amount: editTran[0].amount,
        description: editTran[0].description,
        category: editTran[0].category,
        date: moment(editTran[0].date).format("YYYY-MM-DD"),
        transactionType: editTran[0].transactionType
      });
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle modal visibility
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Handle edit submission
  const handleEditSubmit = async () => {
    try {
      const { data: response } = await axios.put(`${editTransactions}/${currId}`, {
        ...values,
      });

      if (response.success === true) {
        handleClose();
        setRefresh(!refresh);
        window.location.reload();
      } else {
        console.error("Error updating transaction");
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  // Handle delete transaction
  const handleDeleteClick = async (itemId) => {
    try {
      const { data: response } = await axios.post(`${deleteTransactions}/${itemId}`, {
        userId: user._id,
      });

      if (response.success === true) {
        setRefresh(!refresh);
        window.location.reload();
      } else {
        console.error("Error deleting transaction");
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  // Update state when props change
  useEffect(() => {
    setTransactions(data);
  }, [data, user, refresh]);

  // Determine transaction type color and badge
  const getTransactionTypeBadge = (type) => {
    switch(type) {
      case 'Credit': return 'badge bg-success text-white';
      case 'Expense': return 'badge bg-danger text-white';
      case 'Loan': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary text-white';
    }
  };

  return (
    <Container fluid className="px-4">
      <Table responsive hover striped className="shadow-sm">
        <thead className="bg-primary">
          <tr>
            <th className="text-white">Date</th>
            <th className="text-white">Title</th>
            <th className="text-white">Amount</th>
            <th className="text-white">Type</th>
            <th className="text-white">Category</th>
            <th className="text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="text-black">
          {data.map((item, index) => (
            <tr key={index} className="align-middle">
              <td>{moment(item.date).format("YYYY-MM-DD")}</td>
              <td>{item.title}</td>
              <td className="fw-bold">{item.amount}</td>
              <td>
                <span className={getTransactionTypeBadge(item.transactionType)}>
                  {item.transactionType}
                </span>
              </td>
              <td>{item.category}</td>
              <td>
                <div className="d-flex gap-2">
                  <EditNoteIcon
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditClick(item._id)}
                  />
                  <DeleteForeverIcon
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteClick(item._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title className="text-black">Update Transaction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Form.Label className="text-black">Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="text"
                    placeholder="Enter transaction title"
                    value={values.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Label className="text-black">Amount</Form.Label>
                  <Form.Control
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={values.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <Form.Label className="text-black">Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category} className="text-black">
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Label className="text-black">Transaction Type</Form.Label>
                  <Form.Select
                    name="transactionType"
                    value={values.transactionType}
                    onChange={handleChange}
                  >
                    <option value="Credit" className="text-black">Credit</option>
                    <option value="Expense" className="text-black">Debit</option>
                    <option value="Loan" className="text-black">Loan</option>
                  </Form.Select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <Form.Label className="text-black">Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Label className="text-black">Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Update Transaction
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default TableData;