import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../constants";
import NavBar from "../navBar/navBar";

const UserSettings = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}users/me/`);
        setUserDetails((prevState) => ({
          ...prevState,
          email: response.data.email,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
        setErrorMessage("Failed to load user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userDetails.newPassword !== userDetails.confirmNewPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    try {
      await axios.patch(`${API_URL}users/edit/`, {
        email: userDetails.email,
        password: userDetails.newPassword,
        confirm_password: userDetails.confirmNewPassword,
      });
      setSuccessMessage("User details updated successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating user details:", error);
      setErrorMessage("Failed to update user details.");
      setSuccessMessage("");
    }
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
          <div className="user-settings-container">
            <div
              className="col px-2 py-2"
              style={{ paddingLeft: 0, margin: "1rem" }}
            >
              <div className="header-container">
                <h2>User Settings</h2>
              </div>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Change Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter new email"
                    value={userDetails.email}
                    onChange={handleChange}
                    autoComplete="new-email"
                    style={{ width: "20rem" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Change Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                    value={userDetails.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    style={{ width: "20rem" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmNewPassword"
                    placeholder="Confirm new password"
                    value={userDetails.confirmNewPassword}
                    onChange={handleChange}
                    autoComplete="off"
                    style={{ width: "20rem" }}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Update Settings
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserSettings;
