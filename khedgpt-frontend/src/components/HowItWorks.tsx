import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faLeaf, faThermometerHalf, faTint, faWind, faSeedling } from '@fortawesome/free-solid-svg-icons';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-5">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h6 className="text-success text-uppercase fw-bold">How It Works</h6>
          <h2 className="display-5 fw-bold">Detect, Analyze, and Act</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Our platform operates on a simple principle: collect comprehensive data, analyze it intelligently, and provide actionable insights.
          </p>
        </div>
        
        <Row className="g-4 align-items-center">
          <Col lg={6}>
            <div className="position-relative">
              <div 
                className="rounded shadow"
                style={{ 
                  height: '400px', 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Weather Card Overlay */}
              <Card 
                className="position-absolute bg-white shadow p-3"
                style={{ top: '20px', right: '-20px', width: '200px' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <p className="mb-0 small">Maharashtra, India</p>
                    <h4 className="mb-0">32°C</h4>
                  </div>
                  <div className="ms-2">
                    <i className="text-warning fs-2">☀️</i>
                  </div>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between small">
                  <div>
                    <FontAwesomeIcon icon={faThermometerHalf} className="me-1" />
                    <span>H: 34° L: 22°</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between small mt-2">
                  <div>
                    <FontAwesomeIcon icon={faTint} className="me-1" />
                    <span>Humidity: 45%</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faWind} className="me-1" />
                    <span>4.2 km/h</span>
                  </div>
                </div>
              </Card>
              
              {/* Growth Metrics Card */}
              <Card 
                className="position-absolute bg-white shadow p-3"
                style={{ bottom: '20px', left: '-20px', width: '250px' }}
              >
                <h6 className="mb-2">Growth Rate</h6>
                <div style={{ height: '60px' }}>
                  {/* Simplified bar chart */}
                  <div className="d-flex align-items-end h-100">
                    {[20, 35, 25, 40, 30, 45, 50, 42, 38, 55, 48, 60].map((height, i) => (
                      <div 
                        key={i}
                        className="bg-success mx-1 rounded-top"
                        style={{ 
                          height: `${height}%`, 
                          width: '8px',
                          opacity: i % 2 === 0 ? 0.7 : 1
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2 small text-muted">
                  <span>January 01</span>
                  <span>July 01</span>
                </div>
              </Card>
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="ps-lg-4 mt-4 mt-lg-0">
              <h2 className="mb-4">Welcome to KhetGPT</h2>
              <h1 className="display-5 fw-bold mb-4">Bring Growth to Fresh Agriculture</h1>
              <p className="lead mb-4">
                Experience the ultimate farming journey with expert tips, premium data, and professional insights.
              </p>
              
              <div className="d-flex align-items-center mb-4">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <FontAwesomeIcon icon={faSeedling} className="text-success" size="2x" />
                </div>
                <div>
                  <h5 className="mb-1">Data Collection</h5>
                  <p className="text-muted mb-0">Automated drones or satellite imagery and on-ground sensors continuously collect data from your farm.</p>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-4">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <FontAwesomeIcon icon={faLeaf} className="text-success" size="2x" />
                </div>
                <div>
                  <h5 className="mb-1">AI Analysis</h5>
                  <p className="text-muted mb-0">Our powerful AI models combine image and sensor data to generate a detailed analysis of your farm's health.</p>
                </div>
              </div>
              
              <div className="d-flex mt-4">
                <Button variant="success" size="lg" className="me-3">
                  Join Now <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Button>
                <Button variant="outline-secondary" size="lg">
                  Learn Services
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;