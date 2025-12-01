import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faLinkedinIn, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend API
    console.log('Form submitted:', formState);
    // Simulate a successful form submission
    setFormSubmitted(true);
    // Reset form
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div className="py-5 mt-5">
      <Container className="py-5">
        <Row className="mb-5 text-center">
          <Col lg={8} className="mx-auto">
            <h6 className="text-success text-uppercase fw-bold">Contact Us</h6>
            <h1 className="display-4 fw-bold mb-4">Get In Touch</h1>
            <p className="lead mb-0">
              Have questions about KhetGPT? Our team is here to help you transform your farming practices with our AI-powered platform.
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          <Col lg={5} className="mb-5 mb-lg-0">
            <div className="pe-lg-4">
              <h2 className="fw-bold mb-4">Let's discuss how we can help your farm thrive</h2>
              <p className="mb-5">
                Whether you're interested in a demo, have technical questions, or want to explore custom solutions for your agricultural needs, our team is ready to assist.
              </p>
              
              <div className="mb-4 d-flex align-items-start">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-success" />
                </div>
                <div>
                  <h5 className="fw-bold">Visit Us</h5>
                  <p className="text-secondary mb-0">
                    KhetGPT Agriculture Technologies<br />
                    123 Innovation Park, Tech Hub<br />
                    Bengaluru, Karnataka 560001<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="mb-4 d-flex align-items-start">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <FontAwesomeIcon icon={faEnvelope} className="text-success" />
                </div>
                <div>
                  <h5 className="fw-bold">Email Us</h5>
                  <p className="text-secondary mb-0">
                    General Inquiries: info@khetgpt.com<br />
                    Support: support@khetgpt.com<br />
                    Partnerships: partners@khetgpt.com
                  </p>
                </div>
              </div>
              
              <div className="mb-5 d-flex align-items-start">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <FontAwesomeIcon icon={faPhone} className="text-success" />
                </div>
                <div>
                  <h5 className="fw-bold">Call Us</h5>
                  <p className="text-secondary mb-0">
                    Toll-Free: +91 1800 123 4567<br />
                    International: +91 80 2345 6789<br />
                    Hours: Mon-Fri, 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
              
              <h5 className="fw-bold mb-3">Connect With Us</h5>
              <div className="d-flex">
                <a href="#facebook" className="me-2 btn btn-sm btn-outline-success rounded-circle">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#twitter" className="me-2 btn btn-sm btn-outline-success rounded-circle">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#linkedin" className="me-2 btn btn-sm btn-outline-success rounded-circle">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="#instagram" className="btn btn-sm btn-outline-success rounded-circle">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
            </div>
          </Col>
          
          <Col lg={7}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-lg-5">
                <h3 className="fw-bold mb-4">Send Us A Message</h3>
                
                {formSubmitted ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-success display-1"
                      />
                    </div>
                    <h4 className="fw-bold mb-2">Thank you for contacting us!</h4>
                    <p className="text-secondary mb-0">
                      We've received your message and will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="name">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="name"
                            value={formState.name}
                            onChange={handleInputChange}
                            placeholder="John Doe" 
                            required 
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="email">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control 
                            type="email" 
                            name="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com" 
                            required 
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3" controlId="subject">
                      <Form.Label>Subject</Form.Label>
                      <Form.Select 
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Demo Request">Demo Request</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Partnership Opportunity">Partnership Opportunity</option>
                        <option value="Pricing Question">Pricing Question</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-4" controlId="message">
                      <Form.Label>Your Message</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        name="message"
                        value={formState.message}
                        onChange={handleInputChange}
                        rows={5} 
                        placeholder="How can we help you?" 
                        required 
                      />
                    </Form.Group>
                    
                    <Button 
                      variant="success" 
                      type="submit" 
                      className="btn-lg px-5"
                    >
                      Send Message
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div className="mt-5 pt-5">
          <h3 className="fw-bold text-center mb-4">Find Us</h3>
          <div className="rounded shadow-sm overflow-hidden" style={{ height: '400px' }}>
            {/* Replace with actual Google Maps embed */}
            <div 
              className="bg-light w-100 h-100 d-flex align-items-center justify-content-center" 
            >
              <p className="text-secondary">
                Google Maps will be embedded here. <br />
                (Requires Google Maps API integration)
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;