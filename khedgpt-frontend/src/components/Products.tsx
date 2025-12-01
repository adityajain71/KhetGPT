import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface ProductCardProps {
  title: string;
  imageSrc: string;
  alt: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, imageSrc, alt }) => {
  return (
    <Card className="border-0 h-100 product-card overflow-hidden">
      <div 
        className="product-image"
        style={{ 
          height: '200px', 
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.3s ease'
        }}
      />
      <Card.Body className="text-center py-3">
        <h5 className="mb-0">{title}</h5>
      </Card.Body>
    </Card>
  );
};

const Products: React.FC = () => {
  const products = [
    {
      title: 'AgriMonitor',
      imageSrc: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      alt: 'Crop monitoring system'
    },
    {
      title: 'SoilSure',
      imageSrc: 'https://images.unsplash.com/photo-1589928626211-75c0a535f737?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      alt: 'Soil analysis technology'
    },
    {
      title: 'CropAid',
      imageSrc: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      alt: 'Crop management assistant'
    },
    {
      title: 'Assistant',
      imageSrc: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      alt: 'AI farming assistant'
    }
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="py-5">
        <div className="mb-5">
          <h6 className="text-success text-uppercase fw-bold">Our Solutions</h6>
          <Row>
            <Col lg={6}>
              <h2 className="display-5 fw-bold">Discover KhetGPT Modern Farming Solutions</h2>
            </Col>
            <Col lg={6}>
              <p className="lead text-muted mt-3 mt-lg-0">
                At KhetGPT, we offer innovative solutions to revolutionize modern agriculture, helping you increase yields and minimize resource usage.
              </p>
            </Col>
          </Row>
        </div>
        
        <Row className="g-4">
          {products.map((product, index) => (
            <Col sm={6} lg={3} key={index}>
              <ProductCard 
                title={product.title} 
                imageSrc={product.imageSrc} 
                alt={product.alt}
              />
            </Col>
          ))}
        </Row>
        
        <Row className="mt-5 pt-4">
          <Col md={4} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-2">
              <div className="rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></div>
              <h6 className="ms-2 mb-0">Organic Fertilizer</h6>
            </div>
            <p className="text-muted small">Smart recommendations for organic nutrients based on soil analysis.</p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-2">
              <div className="rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></div>
              <h6 className="ms-2 mb-0">Technology Irrigation</h6>
            </div>
            <p className="text-muted small">Precision water management that reduces waste and optimizes crop growth.</p>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center mb-2">
              <div className="rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></div>
              <h6 className="ms-2 mb-0">Agricultural Monitoring</h6>
            </div>
            <p className="text-muted small">Continuous field observation using advanced imaging and sensor technology.</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Products;