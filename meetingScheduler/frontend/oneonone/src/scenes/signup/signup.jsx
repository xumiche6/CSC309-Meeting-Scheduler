import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constants";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import "./style.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}users/register/`, {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error);
      setErrors(
        error.response?.data || {
          non_field_errors: ["An unexpected error occurred"],
        },
      );
    }
  };

  return (
    <Container fluid id={"signup-container"}>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h2 className="text-center mb-4">Create Your Account</h2>
          <div className="d-flex justify-content-center align-items-center">
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Group className="mb-3" controlId="usernameInput">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="emailInput">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="passwordInput">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPasswordInput">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            {errors.non_field_errors &&
              errors.non_field_errors.map((error, index) => (
                <Alert key={index} variant="danger">
                  {error}
                </Alert>
              ))}
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit" className="w-100">
                Sign Up
              </Button>
            </div>
          </Form>
          </div>
          <div className="mt-3 text-center">
            <p>
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
