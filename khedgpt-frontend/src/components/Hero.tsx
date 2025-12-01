import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import TypingAnimation from './TypingAnimation';
import { useTheme } from '../contexts/ThemeContext';
// Import hero section specific styles
import './hero-styles.css';

// Hero animation component
const AnimatedText: React.FC<{text: React.ReactNode, delay?: number}> = ({ text, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`animated-text ${isVisible ? 'visible' : ''}`}
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease'
      }}
    >
      {text}
    </div>
  );
};

const Hero: React.FC = () => {
  const [animateImage, setAnimateImage] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Animate image after a delay
    const timer = setTimeout(() => {
      setAnimateImage(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section py-5 mt-5">
      <Container className="py-5">
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0">
            <h1 className={`display-4 fw-bold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
              <AnimatedText text={<span className="shimmer-text">Transforming Agriculture</span>} delay={100} />
              <AnimatedText text={<span className={theme === 'dark' ? 'text-white' : ''}>with <span className="text-success">AI-Powered</span> Precision</span>} delay={300} />
            </h1>
            <div className={`lead mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
              <AnimatedText 
                text={
                  <p style={{ color: theme === 'dark' ? 'white' : 'inherit' }}>
                    KhetGPT helps farmers <span className="text-success fw-bold">detect crop health issues</span>, soil problems, and pest threats 
                    before they become visible—transitioning from <span className="text-decoration-line-through">reactive</span> to <span className="text-success fw-bold">proactive</span> farm management.
                  </p>
                }
                delay={500}
              />
            </div>
            <div 
              className="d-flex flex-column flex-sm-row gap-3"
              style={{ 
                opacity: animateImage ? 1 : 0, 
                transform: animateImage ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1s ease, transform 1s ease',
                transitionDelay: '700ms'
              }}
            >
              <Button 
                as="a" 
                href="/register" 
                variant="success" 
                size="lg"
                className="btn-pulse"
              >
                Get Started Free
              </Button>
              <Button 
                as="a" 
                href="/demo" 
                variant={theme === 'dark' ? "outline-light" : "outline-dark"}
                size="lg"
                className="btn-hover-slide"
              >
                Watch Demo <FontAwesomeIcon icon={faArrowRight} className="ms-2 btn-icon" />
              </Button>
            </div>
            <div 
              className="mt-4 d-flex align-items-center"
              style={{ 
                opacity: animateImage ? 1 : 0, 
                transform: animateImage ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1s ease, transform 1s ease',
                transitionDelay: '900ms'
              }}
            >
              <div className="d-flex">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`rounded-circle overflow-hidden border ${theme === 'dark' ? 'border-secondary' : 'border-white'}`}
                    style={{
                      width: 40,
                      height: 40,
                      marginLeft: i > 1 ? -15 : 0,
                      backgroundImage: `url(https://randomuser.me/api/portraits/men/${i + 10}.jpg)`,
                      backgroundSize: 'cover',
                      zIndex: 5 - i,
                    }}
                  />
                ))}
              </div>
              <div className="ms-3">
                <p className={`mb-0 ${theme === 'dark' ? 'text-white' : ''}`}>
                  <strong className={theme === 'dark' ? 'text-white' : ''}>500+ farmers</strong> are <TypingAnimation words={['growing crops', 'saving water', 'boosting yields', 'already using KhetGPT']} typingSpeed={80} />
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6} className="d-flex justify-content-center">
            <div 
              className="position-relative"
              style={{ 
                opacity: animateImage ? 1 : 0, 
                transform: animateImage ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1s ease, transform 1s ease',
                transitionDelay: '300ms'
              }}
            >
              {/* Hero image with actual agriculture drone image */}
              <div 
                className="hero-image rounded shadow-lg overflow-hidden"
                style={{ 
                  width: '100%', 
                  height: '400px',
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1313&q=80" 
                  alt="Hands holding soil with young seedling"
                  className="w-100 h-100 object-fit-cover"
                  style={{ objectPosition: 'center' }}
                />
              </div>
              {/* Floating card 1 */}
              <div
                className={`position-absolute ${theme === 'dark' ? 'bg-dark' : 'bg-white'} p-3 rounded shadow floating-card`}
                style={{ bottom: '30px', left: '-20px', maxWidth: '200px' }}
              >
                <h6 className={`mb-1 ${theme === 'dark' ? 'text-white' : ''}`}>Early Detection</h6>
                <p className={`small mb-0 ${theme === 'dark' ? 'text-white' : ''}`}>Identifies issues 2 weeks before visible symptoms</p>
              </div>
              {/* Floating card 2 */}
              <div
                className={`position-absolute ${theme === 'dark' ? 'bg-dark' : 'bg-white'} p-3 rounded shadow floating-card`}
                style={{ top: '30px', right: '-20px', maxWidth: '200px' }}
              >
                <h6 className={`mb-1 ${theme === 'dark' ? 'text-white' : ''}`}>Resource Optimization</h6>
                <p className={`small mb-0 ${theme === 'dark' ? 'text-white' : ''}`}>Reduces water & fertilizer usage by up to 30%</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;