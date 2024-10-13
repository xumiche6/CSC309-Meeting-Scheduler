import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await login(username, password);
      navigate("/schedules");
    } catch (error) {
      console.error("Failed to login", error);
      setLoginError(error.message);
    }
  };

  return (
    <Container fluid id={"login-container"}>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h2 className="text-center mb-4">Login</h2>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="usernameInput">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="passwordInput">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit" className="w-100">
                Log In
              </Button>
            </div>
          </Form>
          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-decoration-none">
                Sign up
              </Link>
            </p>
            {/* <p> commenting cuz we don't have an email sending thing
              <Link to="/forgot_password" className="text-decoration-none">
                Forgot your password?
              </Link>
            </p> */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
