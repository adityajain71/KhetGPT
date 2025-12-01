import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faLeaf, faLightbulb, faGlobe } from '@fortawesome/free-solid-svg-icons';

interface StatItemProps {
  icon: any;
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => {
  return (
    <div className="text-center">
      <div className="mb-3">
        <FontAwesomeIcon icon={icon} size="2x" className="text-success" />
      </div>
      <h2 className="display-4 fw-bold mb-2">{value}</h2>
      <p className="text-muted">{label}</p>
    </div>
  );
};

const Stats: React.FC = () => {
  return (
    <section className="py-5 bg-white">
      <Container className="py-4">
        <Row className="justify-content-center text-center mb-4">
          <Col lg={8}>
            <h6 className="text-success text-uppercase fw-bold">Growing Innovation</h6>
            <h2 className="display-5 fw-bold">Empowering Agriculture</h2>
            <p className="lead text-muted">
              Become part of a supportive community dedicated to leveraging innovation to transform agriculture, 
              putting you in control of your farming operations.
            </p>
          </Col>
        </Row>
        
        <Row className="g-4 py-4">
          <Col md={6} lg={3}>
            <StatItem icon={faUsers} value="12k+" label="Farmers Using KhetGPT" />
          </Col>
          <Col md={6} lg={3}>
            <StatItem icon={faLeaf} value="50%" label="Average Crop Yield Increase" />
          </Col>
          <Col md={6} lg={3}>
            <StatItem icon={faLightbulb} value="45%" label="Reduction in Resource Usage" />
          </Col>
          <Col md={6} lg={3}>
            <StatItem icon={faGlobe} value="28+" label="States Across India" />
          </Col>
        </Row>
        
        <Row className="mt-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div 
              className="rounded shadow"
              style={{ 
                height: '300px', 
                backgroundImage: 'url("https://images.unsplash.com/photo-1628352081506-83d3c8721788?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </Col>
          <Col lg={6}>
            <div className="h-100 d-flex flex-column justify-content-center">
              <h3 className="mb-4">Knock Knock!<br />You've Stepped Into Our Zone!</h3>
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <input type="checkbox" className="form-check-input me-2" checked readOnly />
                  <label className="mb-0">Production Growth by 50% more</label>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <input type="checkbox" className="form-check-input me-2" checked readOnly />
                  <label className="mb-0">Smart Irrigation Systems</label>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <input type="checkbox" className="form-check-input me-2" checked readOnly />
                  <label className="mb-0">Pest Alert System</label>
                </div>
              </div>
              <button className="btn btn-success mt-3">Join Our Family Today</button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Stats;