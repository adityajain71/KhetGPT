import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`py-3 ${scrolled ? (theme === 'dark' ? 'bg-dark shadow-sm' : 'bg-white shadow-sm') : 'bg-transparent'}`}
      variant={theme === 'dark' ? 'dark' : 'light'}
      style={{ transition: 'all 0.3s ease-in-out' }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <div className="me-2">
            {/* If you don't have a logo yet, we'll use text temporarily */}
            {/* <img src={logo} alt="KhetGPT Logo" height="30" /> */}
            <span className="fw-bold text-success">Khet<span className={theme === 'dark' ? 'text-light' : 'text-dark'}>GPT</span></span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
            <Nav.Link as={Link} to="/dashboard" className="mx-2">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/about" className="mx-2">About</Nav.Link>
            <Nav.Link as={Link} to="/features" className="mx-2">Features</Nav.Link>
            <Nav.Link as={Link} to="/pricing" className="mx-2">Pricing</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="mx-2">Contact</Nav.Link>
          </Nav>
          <Nav className="ms-lg-4 align-items-center">
            {user ? (
              <>
                <NavDropdown 
                  title={<span>{user.name}</span>} 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Item className="me-2">
                  <Button 
                    as="a" 
                    href="/login" 
                    variant="outline-success"
                  >
                    Log in
                  </Button>
                </Nav.Item>
                <Nav.Item className="me-2">
                  <Button 
                    as="a" 
                    href="/register" 
                    variant="success"
                  >
                    Sign up
                  </Button>
                </Nav.Item>
              </>
            )}
            <Nav.Item className="ms-2">
              <ThemeToggle />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;