import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import CropDiseaseDetection from '../components/CropDiseaseDetection';
import { Container, Row, Col } from 'react-bootstrap';

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <h1>API Test Page</h1>
      
      <Row className="mb-5">
        <Col md={6}>
          <div className="border rounded p-4 mb-4">
            <h2>Step 1: Login</h2>
            <p>Use the credentials: demo@khetgpt.com / password</p>
            <LoginForm onLoginSuccess={() => alert('Login successful! You can now use the crop disease detection.')} />
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <h2>Step 2: Test Crop Disease Detection</h2>
          <CropDiseaseDetection />
        </Col>
      </Row>
    </Container>
  );
};

export default TestPage;