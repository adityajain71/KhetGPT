import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant={theme === 'dark' ? 'light' : 'dark'}
      size="sm"
      className="rounded-circle p-2"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ width: '38px', height: '38px' }}
    >
      <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
    </Button>
  );
};

export default ThemeToggle;