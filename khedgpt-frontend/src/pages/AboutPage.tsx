import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutPage: React.FC = () => {
  return (
    <Container className="py-5 mt-5">
      <Row className="mb-4">
        <Col>
          <h1>About KhetGPT</h1>
          <p className="lead">
            KhetGPT is an AI-powered platform designed to help farmers monitor crop health, 
            soil conditions, and pest risks to optimize agricultural practices.
          </p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <h2>Our Mission</h2>
          <p>
            At KhetGPT, we're dedicated to transforming agriculture through cutting-edge technology. 
            Our mission is to empower farmers with real-time insights and predictive analytics, 
            enabling them to make data-driven decisions that optimize crop yields, conserve resources, 
            and promote sustainable farming practices.
          </p>
        </Col>
        <Col md={6}>
          <h2>Our Vision</h2>
          <p>
            We envision a future where every farmer has access to advanced agricultural monitoring tools, 
            regardless of farm size or resources. By democratizing access to precision agriculture technology, 
            we aim to contribute to global food security and sustainable agricultural practices.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
