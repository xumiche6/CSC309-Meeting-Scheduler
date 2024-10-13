import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../navBar/navBar";
import { API_URL } from "../../constants";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", email: "" });
  const [editingContact, setEditingContact] = useState({
    id: null,
    name: "",
    email: "",
  });
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}contacts/list/`);
      setContacts(response.data);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}contacts/create/`, newContact);
      fetchContacts();
      setShowAddModal(false);
      setNewContact({ name: "", email: "" });
    } catch (error) {
      console.error("Failed to add contact", error);
    }
  };

  const handleEditContact = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}contacts/${editingContact.id}/update/`,
        editingContact
      );
      fetchContacts();
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to edit contact", error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}contacts/${id}/delete/`);
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact", error);
    }
  };

  const handleShowEditModal = (contact) => {
    setEditingContact(contact);
    setShowEditModal(true);
  };

  return (
    <Container fluid className="px-0">
      <Row
        className="flex-nowrap"
        style={{ overflowY: "hidden", width: "100vw" }}
      >
        <Col
          auto="true"
          md={3}
          xl={2}
          className="px-sm-2 px-0 bg-dark"
          style={{ paddingTop: "1.5rem", minHeight: "100vh" }}
        >
          <NavBar />
        </Col>
        <Col>
          <Container>
            <div className="header-container my-4">
              <h1>Your Contacts</h1>
              <Button onClick={() => setShowAddModal(true)}>Add Contact</Button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowEditModal(contact)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-2 custom-btn-size"
                        style={{ padding: "0.375rem 0.75rem" }} // Inline styles example
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditContact}>
                <Form.Group className="mb-3" controlId="editContactName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={editingContact.name}
                    onChange={(e) =>
                      setEditingContact({
                        ...editingContact,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="editContactEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={editingContact.email}
                    onChange={(e) =>
                      setEditingContact({
                        ...editingContact,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddContact}>
                <Form.Group className="mb-3" controlId="contactName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="contactEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Add Contact
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacts;
