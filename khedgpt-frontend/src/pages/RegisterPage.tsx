import React, { useState, FormEvent } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  
  const { signup, isLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const passedTests = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (passedTests <= 2) {
      setPasswordStrength('weak');
    } else if (passedTests === 3) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false || password !== confirmPassword || !agreeTerms) {
      event.stopPropagation();
      setValidated(true);
      
      if (password !== confirmPassword) {
        setRegisterError('Passwords do not match');
      } else if (!agreeTerms) {
        setRegisterError('You must agree to the Terms of Service and Privacy Policy');
      }
      
      return;
    }

    try {
      setRegisterError(null);
      const success = await signup(name, email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setRegisterError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <div className="text-center mb-5">
            <Link to="/" className="d-inline-block mb-4">
              <h2 className="fw-bold text-success">Khet<span className={theme === 'dark' ? 'text-light' : 'text-dark'}>GPT</span></h2>
            </Link>
            <h1 className="fw-bold mb-2">Create Account</h1>
            <p className="text-muted">Join KhetGPT to monitor and optimize your farm</p>
          </div>
          
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-lg-5">
              {registerError && (
                <Alert variant="danger" dismissible onClose={() => setRegisterError(null)}>
                  {registerError}
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your name.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email address.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
                      }}
                      placeholder="Create a password"
                      required
                      minLength={6}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 6 characters.
                    </Form.Control.Feedback>
                  </div>
                  
                  {password && (
                    <div className="mt-2">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 me-2">
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className={`progress-bar ${
                                passwordStrength === 'weak' ? 'bg-danger' : 
                                passwordStrength === 'medium' ? 'bg-warning' : 'bg-success'
                              }`}
                              role="progressbar"
                              style={{ 
                                width: passwordStrength === 'weak' ? '33%' : 
                                       passwordStrength === 'medium' ? '66%' : '100%' 
                              }}
                            />
                          </div>
                        </div>
                        <small className={
                          passwordStrength === 'weak' ? 'text-danger' : 
                          passwordStrength === 'medium' ? 'text-warning' : 'text-success'
                        }>
                          {passwordStrength === 'weak' ? 'Weak' : 
                           passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                        </small>
                      </div>
                      <small className="text-muted d-block mt-1">
                        Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.
                      </small>
                    </div>
                  )}
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      isInvalid={validated && password !== confirmPassword}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Passwords do not match.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="termsCheck">
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        I agree to the <Link to="/terms" className="text-decoration-none">Terms of Service</Link> and <Link to="/privacy-policy" className="text-decoration-none">Privacy Policy</Link>
                      </>
                    }
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    isInvalid={validated && !agreeTerms}
                    feedback="You must agree to the terms before registering."
                    feedbackType="invalid"
                  />
                </Form.Group>
                
                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100 py-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                      Sign Up
                    </>
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account? <Link to="/login" className="text-decoration-none">Sign in</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
