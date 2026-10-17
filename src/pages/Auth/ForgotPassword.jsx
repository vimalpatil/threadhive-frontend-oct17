import { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import './Auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Forgot password request:', email);
    setEmail('');
  };

  return (
    <Container
      fluid
      className="auth-container d-flex align-items-center justify-content-center"
    >
      <Card className="auth-card shadow-lg border-0 rounded-4 p-4 p-md-5">
        <h2 className="auth-title">Forgot Password</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Floating className="mb-4">
            <Form.Control
              id="forgotPasswordEmail"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder=" "
              required
              className="auth-form-control"
            />
            <label htmlFor="forgotPasswordEmail" className="auth-form-label">
              Email
            </label>
          </Form.Floating>

          <Button type="submit" variant="primary" className="auth-submit-btn">
            <i className="bi bi-envelope me-2"></i>
            Send Reset Link
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ForgotPassword;
