import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col>
          <h1>Privacy Policy</h1>
          <p>Last updated: September 13, 2025</p>
          
          <section className="my-4">
            <h2>Introduction</h2>
            <p>
              At KhetGPT, we are committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you 
              use our agricultural monitoring platform.
            </p>
          </section>
          
          <section className="my-4">
            <h2>Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, phone number, 
              and farm location details. We also collect agricultural data including soil information, 
              crop data, and farm analytics.
            </p>
          </section>
          
          <section className="my-4">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Privacy Policy, please contact us at:
              <br />
              Email: privacy@khetgpt.com
              <br />
              Phone: +91 98765 43210
            </p>
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicyPage;
