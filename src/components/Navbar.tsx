import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { matrics, megama, piano, wall } from "../public/dropDown_NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';

export function Nav_componnets() {
  return (
    <Navbar sticky="top" bg="light" expand="lg" className="shadow-sm mb-3 mt-0">
      <Container>
        <Navbar.Brand as={Link} to="/">Bina</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/newDapit">Dapit</Nav.Link>
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
