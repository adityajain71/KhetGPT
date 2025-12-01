import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../contexts/ThemeContext';

interface PricingFeature {
  title: string;
  basic: boolean;
  standard: boolean;
  premium: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  buttonText: string;
  buttonVariant: string;
  popular?: boolean;
}

const PricingPage: React.FC = () => {
  const { theme } = useTheme();
  const [billingAnnually, setBillingAnnually] = useState<boolean>(true);
  
  const pricingPlans: PricingPlan[] = [
    {
      name: 'Basic',
      price: billingAnnually ? '₹999' : '₹119',
      period: billingAnnually ? '/year' : '/month',
      description: 'Perfect for small farms and individual farmers getting started with precision agriculture.',
      buttonText: 'Start Free Trial',
      buttonVariant: 'outline-success'
    },
    {
      name: 'Standard',
      price: billingAnnually ? '₹2,999' : '₹299',
      period: billingAnnually ? '/year' : '/month',
      description: 'Ideal for medium-sized farms looking to improve productivity and sustainability.',
      buttonText: 'Get Started',
      buttonVariant: 'success',
      popular: true
    },
    {
      name: 'Premium',
      price: billingAnnually ? '₹7,999' : '₹799',
      period: billingAnnually ? '/year' : '/month',
      description: 'Comprehensive solution for large farms and agricultural businesses with advanced needs.',
      buttonText: 'Contact Sales',
      buttonVariant: 'outline-success'
    }
  ];
  
  const pricingFeatures: PricingFeature[] = [
    { title: 'Crop Health Monitoring', basic: true, standard: true, premium: true },
    { title: 'Basic Disease Detection', basic: true, standard: true, premium: true },
    { title: 'Mobile App Access', basic: true, standard: true, premium: true },
    { title: 'Weekly Field Reports', basic: false, standard: true, premium: true },
    { title: 'Advanced Analytics Dashboard', basic: false, standard: true, premium: true },
    { title: 'Weather Integration', basic: false, standard: true, premium: true },
    { title: 'Pest & Disease Alerts', basic: false, standard: true, premium: true },
    { title: 'Soil Analysis', basic: false, standard: false, premium: true },
    { title: 'Yield Prediction', basic: false, standard: false, premium: true },
    { title: 'Custom Recommendations', basic: false, standard: false, premium: true },
    { title: 'API Access', basic: false, standard: false, premium: true },
    { title: 'Priority Support', basic: false, standard: false, premium: true }
  ];

  return (
    <div className="py-5 mt-5">
      <Container className="py-5">
        <Row className="mb-5 text-center">
          <Col lg={8} className="mx-auto">
            <h6 className="text-success text-uppercase fw-bold">Pricing Plans</h6>
            <h1 className="display-4 fw-bold mb-4">Choose the Perfect Plan for Your Farm</h1>
            <p className="lead mb-5">
              Affordable solutions for farms of all sizes. Start with a 14-day free trial on any plan.
            </p>
            
            <div className="d-flex align-items-center justify-content-center mb-5">
              <span className={`me-3 ${billingAnnually ? 'text-muted' : ''}`}>Monthly</span>
              <Form.Check 
                type="switch"
                id="billing-switch"
                checked={billingAnnually}
                onChange={() => setBillingAnnually(!billingAnnually)}
                className="d-inline-block mx-2"
              />
              <span className={`ms-3 ${!billingAnnually ? 'text-muted' : ''}`}>
                Annually <Badge bg="success" className="ms-2">Save 30%</Badge>
              </span>
            </div>
          </Col>
        </Row>
        
        <Row className="g-4 mb-5">
          {pricingPlans.map((plan, index) => (
            <Col lg={4} key={index}>
              <Card className={`h-100 shadow-sm ${plan.popular ? 'border-success' : ''}`}>
                {plan.popular && (
                  <div className="bg-success text-white text-center py-2">
                    <small className="fw-bold text-uppercase">Most Popular</small>
                  </div>
                )}
                <Card.Body className="p-4">
                  <h3 className="fw-bold">{plan.name}</h3>
                  <div className="my-4">
                    <span className="display-4 fw-bold">{plan.price}</span>
                    <span className="text-muted">{plan.period}</span>
                  </div>
                  <p className={`mb-4 ${theme === 'dark' ? 'text-white-50' : 'text-secondary'}`}>{plan.description}</p>
                  <Button 
                    variant={plan.buttonVariant} 
                    size="lg" 
                    className="w-100"
                  >
                    {plan.buttonText}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <h2 className="fw-bold text-center mb-5">Feature Comparison</h2>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ minWidth: '230px' }}>Feature</th>
                <th className="text-center">Basic</th>
                <th className="text-center">Standard</th>
                <th className="text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {pricingFeatures.map((feature, index) => (
                <tr key={index}>
                  <td>{feature.title}</td>
                  <td className="text-center">
                    {feature.basic ? 
                      <FontAwesomeIcon icon={faCheck} className="text-success" /> : 
                      <FontAwesomeIcon icon={faTimes} className="text-muted" />}
                  </td>
                  <td className="text-center">
                    {feature.standard ? 
                      <FontAwesomeIcon icon={faCheck} className="text-success" /> : 
                      <FontAwesomeIcon icon={faTimes} className="text-muted" />}
                  </td>
                  <td className="text-center">
                    {feature.premium ? 
                      <FontAwesomeIcon icon={faCheck} className="text-success" /> : 
                      <FontAwesomeIcon icon={faTimes} className="text-muted" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Row className="mt-5 pt-5">
          <Col md={8} className="mx-auto text-center">
            <h2 className="fw-bold mb-4">Need a custom solution?</h2>
            <p className="lead mb-4">
              We offer tailored plans for agricultural cooperatives, government agencies, and enterprise clients.
            </p>
            <Button variant="success" size="lg">Contact Our Team</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PricingPage;