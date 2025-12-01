import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const CookiePolicyPage: React.FC = () => {
  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col>
          <h1>Cookie Policy</h1>
          <p>Last updated: September 13, 2025</p>
          
          <section className="my-4">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small pieces of text sent by your web browser by a website you visit. 
              A cookie file is stored in your web browser and allows the Service or a third-party 
              to recognize you and make your next visit easier and the Service more useful to you.
            </p>
          </section>
          
          <section className="my-4">
            <h2>How KhetGPT Uses Cookies</h2>
            <p>
              We use cookies to understand and save user preferences for future visits, 
              keep track of advertisements, and compile aggregate data about site traffic 
              and site interactions.
            </p>
          </section>
          
          <section className="my-4">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at:
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

export default CookiePolicyPage;
