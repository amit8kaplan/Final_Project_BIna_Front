import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { instructorsData, trainersData, sessionsData, groupsData, matricsData } from "../public/data";
import ChatBotModal from './ChatBot';  // Import the ChatBotModal component
import SessionModal from './SessionModal';  // Import the SessionModal component
// import CurrentSession from './CurrentSession';  // Import the CurrentSession component
export function Nav_componnets() {
  const location = useLocation();
  const navigate = useNavigate();
  const instructors = instructorsData;
  const trainers = trainersData;
  const sessions = sessionsData;
  const groups = groupsData;

  const handleAddDapit = () => {
    navigate('/newDapit', {
      state: { instructors: instructors, trainers: trainers, sessions: sessions, groups: groups }
    });
  };

  return (
    <Navbar sticky="top" bg="light" expand="lg" className="shadow-sm mb-3 mt-0">
      <Container>
        <Navbar.Brand as={Link} to="/">Bina</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              className="nav-link"
              to="/AddDapit"
              state={{ instructors: instructors, trainers: trainers, sessions: sessions, groups: groups }}
            >Dapit</NavLink>
            <Nav.Link as={Link} to="/viewDapit">View</Nav.Link>
            <NavDropdown title="Wall" id="basic-nav-dropdown">
              {trainersData.map((item, index) => (
                <NavDropdown.Item
                  key={index}
                  as={Link}
                  to={"/Wall"}
                  state={{ trainerName: item, instructors: instructors, trainers: trainers, sessions: sessions, groups: groups }}
                >
                  {item}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Piano" id="basic-nav-dropdown">
              {groupsData.map((item, index) => (
                <NavDropdown.Item
                  key={index}
                  as={Link}
                  to={"/Piano"}
                  state={{ group: item }}
                >
                  {item}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Megame" id="basic-nav-dropdown">
              {groupsData.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={'/Megama'} state={{ group: item }}>
                  {item}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Matrics" id="basic-nav-dropdown">
              {matricsData.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={'/Matrics'} state={{ matrics: item }}>
                  {item}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <ChatBotModal />  {/* Add the ChatBotModal component here */}
          <SessionModal />  {/* Add the SessionModal component here */}
          {/* <CurrentSession /> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
