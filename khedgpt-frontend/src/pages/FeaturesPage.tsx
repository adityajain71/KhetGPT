import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, 
  faChartLine, 
  faRobot, 
  faMobileAlt, 
  faCloudSunRain, 
  faMapMarkedAlt,
  faSatellite,
  faFlask,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../contexts/ThemeContext';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  const { theme } = useTheme();
  
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body className="p-4">
        <div className={`bg-${color} bg-opacity-10 rounded-circle p-3 mb-4 d-inline-block`}>
          <FontAwesomeIcon icon={icon} className={`text-${color} fs-3`} />
        </div>
        <h4>{title}</h4>
        <p className={`mb-0 ${theme === 'dark' ? 'text-white-50' : 'text-secondary'}`}>{description}</p>
      </Card.Body>
    </Card>
  );
};

const FeaturesPage: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: faLeaf,
      title: 'Early Disease Detection',
      description: 'Identify crop diseases up to 2 weeks before visible symptoms appear with our advanced multispectral imaging analysis.',
      color: 'success'
    },
    {
      icon: faChartLine,
      title: 'Yield Prediction',
      description: 'Accurately forecast harvest yields based on current crop health, historical data, and environmental conditions.',
      color: 'primary'
    },
    {
      icon: faRobot,
      title: 'AI-Powered Recommendations',
      description: 'Receive personalized, data-driven recommendations for irrigation, fertilization, and pest management.',
      color: 'info'
    },
    {
      icon: faMobileAlt,
      title: 'Mobile Monitoring',
      description: 'Access your farm\'s health metrics anytime, anywhere through our responsive mobile application.',
      color: 'warning'
    },
    {
      icon: faCloudSunRain,
      title: 'Weather Integration',
      description: 'Intelligent weather forecasting integrated with farm management recommendations.',
      color: 'danger'
    },
    {
      icon: faMapMarkedAlt,
      title: 'Precision Mapping',
      description: 'Generate detailed field maps showing variation in crop health, soil moisture, and nutrient levels.',
      color: 'success'
    },
    {
      icon: faSatellite,
      title: 'Satellite & Drone Integration',
      description: 'Seamlessly integrate data from satellites and drones to monitor large areas efficiently.',
      color: 'primary'
    },
    {
      icon: faFlask,
      title: 'Soil Analysis',
      description: 'Comprehensive soil health monitoring to optimize nutrient management and improve crop quality.',
      color: 'info'
    },
    {
      icon: faShieldAlt,
      title: 'Pest & Disease Alerts',
      description: 'Real-time alerts for potential pest outbreaks and disease spread based on environmental conditions.',
      color: 'warning'
    }
  ];

  return (
    <div className="py-5 mt-5">
      <Container className="py-5">
        <Row className="mb-5 text-center">
          <Col lg={8} className="mx-auto">
            <h6 className="text-success text-uppercase fw-bold">Our Features</h6>
            <h1 className="display-4 fw-bold mb-4">Advanced Agricultural Intelligence</h1>
            <p className="lead mb-0">
              KhetGPT combines cutting-edge technology with agricultural expertise to provide farmers with powerful tools for sustainable and profitable farming.
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col lg={4} md={6} key={index}>
              <FeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
                color={feature.color}
              />
            </Col>
          ))}
        </Row>
        
        <Row className="mt-5 pt-5 text-center">
          <Col lg={8} className="mx-auto">
            <h2 className="fw-bold mb-4">Transform Your Farming Practice</h2>
            <p className="lead mb-4">
              Join thousands of progressive farmers who are increasing yields, reducing costs, and farming more sustainably with KhetGPT's precision agriculture platform.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FeaturesPage;