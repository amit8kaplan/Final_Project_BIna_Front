import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link , useNavigate, useLocation, NavLink} from "react-router-dom";
import { matrics, megama, piano, wall } from "../public/dropDown_NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { instructorsData, trainersData, sessionsData, groupsData } from "../public/data";
import { group } from "console";




export function Nav_componnets() {
  const location = useLocation();
  const navigate = useNavigate();
const instructors = instructorsData;
const trainers = trainersData
const sessions = sessionsData
const groups = groupsData
  const handleAddDapit = () => {
    navigate('/newDapit',{
      state: {instructors: instructors, trainers: trainers, sessions: sessions, groups: groups}
    
    });
  }
  return (
    <Navbar sticky="top" bg="light" expand="lg" className="shadow-sm mb-3 mt-0">
      <Container>
        <Navbar.Brand as={Link} to="/">Bina</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <NavLink 
              className="nav-link"
              to="/AddDapit"
              state={{instructors: instructors, trainers: trainers, sessions: sessions, groups: groups}}
            >Dapit</NavLink>
            <Nav.Link as={Link} to="/viewDapit">View</Nav.Link>
            <NavDropdown title="Wall" id="basic-nav-dropdown">
              {wall[0].items.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={item.to}>
                  {item.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Piano" id="basic-nav-dropdown">
              {piano[0].items.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={item.to}>
                  {item.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Megame" id="basic-nav-dropdown">
              {megama[0].items.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={item.to}>
                  {item.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Matrics" id="basic-nav-dropdown">
              {matrics[0].items.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={item.to}>
                  {item.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
