import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faTemperatureHigh, faTint, faBug, faMapMarkerAlt, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import CropDiseaseDetection from '../components/CropDiseaseDetection';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [selectedField, setSelectedField] = useState<string>('Field 1');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [chartOptions, setChartOptions] = useState<any>({});
  const [pieOptions, setPieOptions] = useState<any>({});

  // Mock data for charts
  const healthIndexData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Crop Health Index',
        data: [75, 82, 78, 85, 90, 87, 92],
        fill: false,
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderColor: 'rgba(40, 167, 69, 1)',
        tension: 0.4,
      },
    ],
  };

  const soilMoistureData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: [45, 52, 49, 60, 55, 58, 62],
        fill: false,
        backgroundColor: 'rgba(13, 110, 253, 0.2)',
        borderColor: 'rgba(13, 110, 253, 1)',
        tension: 0.4,
      },
    ],
  };

  const pestRiskData = {
    labels: ['Low', 'Moderate', 'High'],
    datasets: [
      {
        label: 'Pest Risk Levels',
        data: [65, 25, 10],
        backgroundColor: [
          'rgba(40, 167, 69, 0.6)',
          'rgba(255, 193, 7, 0.6)',
          'rgba(220, 53, 69, 0.6)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const nutrientLevelsData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'Calcium', 'Magnesium'],
    datasets: [
      {
        label: 'Current Levels',
        data: [80, 65, 72, 58, 62],
        backgroundColor: 'rgba(40, 167, 69, 0.6)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1,
      },
      {
        label: 'Optimal Levels',
        data: [85, 70, 75, 65, 60],
        backgroundColor: 'rgba(13, 110, 253, 0.6)',
        borderColor: 'rgba(13, 110, 253, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Greeting will be added directly in the JSX

  // Update chart options based on theme
  useEffect(() => {
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: theme === 'dark' ? '#f8f9fa' : '#212529'
          }
        },
        tooltip: {
          titleColor: theme === 'dark' ? '#f8f9fa' : '#212529',
          bodyColor: theme === 'dark' ? '#f8f9fa' : '#212529',
          backgroundColor: theme === 'dark' ? 'rgba(33, 37, 41, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: theme === 'dark' ? '#f8f9fa' : '#212529',
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: theme === 'dark' ? '#f8f9fa' : '#212529'
          }
        },
        x: {
          grid: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: theme === 'dark' ? '#f8f9fa' : '#212529'
          }
        }
      },
    });

    setPieOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: theme === 'dark' ? '#f8f9fa' : '#212529'
          }
        },
        tooltip: {
          titleColor: theme === 'dark' ? '#f8f9fa' : '#212529',
          bodyColor: theme === 'dark' ? '#f8f9fa' : '#212529',
          backgroundColor: theme === 'dark' ? 'rgba(33, 37, 41, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: theme === 'dark' ? '#f8f9fa' : '#212529',
        }
      }
    });
  }, [theme]);

  // Check authentication before rendering
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Container fluid className="py-5 mt-5">
      {user && (
        <div className="alert alert-success mb-4">
          <h4 className="mb-1">Welcome back, {user.name}!</h4>
          <p className="mb-0">Here's the latest information about your farm.</p>
        </div>
      )}
      <Row className="mb-4">
        <Col md={8}>
          <h2 className="fw-bold">Farm Health Dashboard</h2>
          <p className="text-secondary">Monitor your crop health, soil conditions, and environmental factors in real-time</p>
        </Col>
        <Col md={4} className="d-flex justify-content-md-end align-items-center">
          <Form.Select 
            className="me-2" 
            style={{ maxWidth: '150px' }}
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option>Field 1</option>
            <option>Field 2</option>
            <option>Field 3</option>
            <option>All Fields</option>
          </Form.Select>
          <Form.Control
            type="date"
            style={{ maxWidth: '150px' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-4 mb-lg-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                <FontAwesomeIcon icon={faLeaf} className="text-success fs-3" />
              </div>
              <div>
                <h6 className="text-secondary mb-1">Crop Health Index</h6>
                <h3 className="mb-0 fw-bold">92%</h3>
                <small className="text-success">↑ 5% from last week</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-4 mb-lg-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                <FontAwesomeIcon icon={faTint} className="text-primary fs-3" />
              </div>
              <div>
                <h6 className="text-secondary mb-1">Soil Moisture</h6>
                <h3 className="mb-0 fw-bold">62%</h3>
                <small className="text-success">↑ 7% from last week</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-4 mb-lg-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                <FontAwesomeIcon icon={faBug} className="text-warning fs-3" />
              </div>
              <div>
                <h6 className="text-secondary mb-1">Pest Risk</h6>
                <h3 className="mb-0 fw-bold">Low</h3>
                <small className="text-success">No change from last week</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 me-3">
                <FontAwesomeIcon icon={faTemperatureHigh} className="text-danger fs-3" />
              </div>
              <div>
                <h6 className="text-secondary mb-1">Temperature</h6>
                <h3 className="mb-0 fw-bold">24°C</h3>
                <small className="text-danger">↑ 2°C from last week</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'overview')}
        className="mb-4"
      >
        <Tab eventKey="overview" title="Overview">
          <Row>
            <Col lg={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Crop Health Trends</h5>
                </Card.Header>
                <Card.Body>
                  <Line data={healthIndexData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Pest Risk Analysis</h5>
                </Card.Header>
                <Card.Body>
                  <Pie data={pestRiskData} options={pieOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Soil Moisture Levels</h5>
                </Card.Header>
                <Card.Body>
                  <Line data={soilMoistureData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Nutrient Levels</h5>
                </Card.Header>
                <Card.Body>
                  <Bar data={nutrientLevelsData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="map" title="Field Map">
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Field Map View</h5>
                <div>
                  <Button variant="outline-secondary" size="sm" className="me-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="me-1" /> Layers
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" /> Markers
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div 
                className="bg-light rounded" 
                style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <p className="text-secondary">
                  Interactive field map will be displayed here. <br />
                  (Requires Leaflet integration)
                </p>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="analytics" title="Analytics">
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Advanced Analytics</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-secondary mb-4">AI-powered insights and predictions based on your farm data:</p>
              <Row className="g-4">
                <Col md={4}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-bold">Crop Health Prediction</h6>
                      <p className="small">Predicted crop health index for next 30 days: <span className="text-success fw-bold">95%</span></p>
                      <p className="small text-secondary mb-0">Based on current conditions, weather forecast, and historical patterns</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-bold">Resource Optimization</h6>
                      <p className="small">Recommended irrigation: <span className="text-primary fw-bold">Reduce by 15%</span></p>
                      <p className="small text-secondary mb-0">Soil moisture levels are optimal with forecast rain in 48 hours</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-bold">Pest Risk Alert</h6>
                      <p className="small">Potential aphid risk detected in southeast section</p>
                      <p className="small text-secondary mb-0">Early intervention recommended within 7 days</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="disease" title="Disease Detection">
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Crop Disease Detection</h5>
            </Card.Header>
            <Card.Body style={{ overflow: 'visible' }}>
              <CropDiseaseDetection />
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Recent Alerts & Notifications</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="p-3 border-bottom">
                <div className="d-flex">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3" style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faLeaf} />
                  </div>
                  <div>
                    <h6 className="mb-1">Optimal Crop Health Detected</h6>
                    <p className="small text-secondary mb-0">Field 1 is showing excellent health metrics across all indicators</p>
                    <small className="text-muted">Today, 9:45 AM</small>
                  </div>
                </div>
              </div>
              <div className="p-3 border-bottom">
                <div className="d-flex">
                  <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 me-3" style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faTint} />
                  </div>
                  <div>
                    <h6 className="mb-1">Irrigation Schedule Updated</h6>
                    <p className="small text-secondary mb-0">Watering schedule adjusted based on soil moisture levels and weather forecast</p>
                    <small className="text-muted">Yesterday, 3:20 PM</small>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="d-flex">
                  <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 me-3" style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faBug} />
                  </div>
                  <div>
                    <h6 className="mb-1">Early Pest Risk Detected</h6>
                    <p className="small text-secondary mb-0">Multispectral imaging detected potential early signs of pest activity in southeast section</p>
                    <small className="text-muted">Sep 11, 11:30 AM</small>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white">
              <Button variant="link" className="text-decoration-none p-0">View all notifications</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;