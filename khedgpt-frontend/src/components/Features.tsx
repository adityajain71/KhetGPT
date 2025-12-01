import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCamera, 
  faSeedling, 
  faChartLine, 
  faMapMarkedAlt,
  faCloud,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="border-0 shadow-sm h-100 p-4">
      <div className="text-center mb-3">
        <div className="rounded-circle bg-success bg-opacity-10 p-3 d-inline-flex">
          <FontAwesomeIcon icon={icon} className="text-success" size="2x" />
        </div>
      </div>
      <Card.Body className="text-center">
        <h4 className="mb-3">{title}</h4>
        <p className="text-muted">{description}</p>
      </Card.Body>
    </Card>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: faCamera,
      title: 'Multispectral Imaging',
      description: 'Analyze hyperspectral images to detect crop stress, nutrient deficiencies, and diseases before they are visible to the human eye.'
    },
    {
      icon: faSeedling,
      title: 'Environmental Sensing',
      description: 'Integrate real-time sensor data on soil moisture, temperature, and nutrients for a comprehensive view of your farm ecosystem.'
    },
    {
      icon: faChartLine,
      title: 'AI-Powered Analytics',
      description: 'Our advanced AI models analyze multiple data sources to provide early detection and precise recommendations for intervention.'
    },
    {
      icon: faMapMarkedAlt,
      title: 'Field-Level Mapping',
      description: 'Generate detailed maps of your farm with precise geolocation of areas that require attention for targeted interventions.'
    },
    {
      icon: faCloud,
      title: 'Weather Integration',
      description: 'Correlate crop health with weather patterns to make better predictions and prepare for changing conditions.'
    },
    {
      icon: faShieldAlt,
      title: 'Pest & Disease Alert',
      description: 'Receive early warnings about potential pest outbreaks and disease spread based on environmental conditions and crop health indicators.'
    }
  ];

  return (
    <section className="py-5 bg-light" id="features">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h6 className="text-success text-uppercase fw-bold">Features</h6>
          <h2 className="display-5 fw-bold">Revolutionize Your Farming Approach</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            KhetGPT integrates cutting-edge technology to transform traditional farming into a data-driven, proactive practice.
          </p>
        </div>
        
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={6} lg={4} key={index}>
              <FeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features;