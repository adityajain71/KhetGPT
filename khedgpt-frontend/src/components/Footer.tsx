import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <Container>
        <Row>
          <Col lg={4} className="mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faLeaf} className="text-success me-2" size="2x" />
              <h4 className="mb-0">KhetGPT</h4>
            </div>
            <p className="text-muted mb-4">
              Transforming agriculture with AI-powered precision monitoring for proactive farm management.
            </p>
            <div className="d-flex">
              <a href="https://facebook.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="https://twitter.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://instagram.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="https://linkedin.com" className="text-white" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </div>
          </Col>
          <Col lg={2} md={4} className="mb-4 mb-md-0">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/features" className="text-muted text-decoration-none">Features</Link></li>
              <li className="mb-2"><Link to="/pricing" className="text-muted text-decoration-none">Pricing</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-muted text-decoration-none">Contact</Link></li>
            </ul>
          </Col>
          <Col lg={2} md={4} className="mb-4 mb-md-0">
            <h6 className="text-white mb-3">Solutions</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/features" className="text-muted text-decoration-none">AgriMonitor</Link></li>
              <li className="mb-2"><Link to="/features" className="text-muted text-decoration-none">SoilSure</Link></li>
              <li className="mb-2"><Link to="/features" className="text-muted text-decoration-none">CropAid</Link></li>
              <li className="mb-2"><Link to="/features" className="text-muted text-decoration-none">Assistant</Link></li>
            </ul>
          </Col>
          <Col lg={4} md={4}>
            <h6 className="text-white mb-3">Contact</h6>
            <p className="text-muted mb-2">Maharashtra, India</p>
            <p className="text-muted mb-2">Email: info@khetgpt.com</p>
            <p className="text-muted mb-2">Phone: +91 98765 43210</p>
            <div className="mt-4">
              <input type="email" className="form-control mb-2" placeholder="Your email" />
              <button className="btn btn-success">Subscribe</button>
            </div>
          </Col>
        </Row>
        <hr className="my-4 bg-secondary" />
        <div className="text-center text-muted">
          <small>&copy; {new Date().getFullYear()} KhetGPT. All rights reserved.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;