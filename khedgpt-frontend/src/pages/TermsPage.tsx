import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const TermsPage: React.FC = () => {
  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col>
          <h1>Terms of Service</h1>
          <p>Last updated: September 13, 2025</p>
          
          <section className="my-4">
            <h2>1. Introduction</h2>
            <p>
              Welcome to KhetGPT! These Terms of Service govern your use of the KhetGPT website 
              and agricultural monitoring platform operated by KhetGPT.
            </p>
          </section>
          
          <section className="my-4">
            <h2>2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for safeguarding your account credentials and for any activities that 
              occur under your account.
            </p>
          </section>
          
          <section className="my-4">
            <h2>3. Contact Us</h2>
            <p>
              If you have any questions about our Terms of Service, please contact us at:
              <br />
              Email: legal@khetgpt.com
              <br />
              Phone: +91 98765 43210
            </p>
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default TermsPage;
