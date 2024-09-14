import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
// import { instructorsData, trainersData, sessionsData, groupsData, matricsData } from "../public/data";
import ChatBotModal from './ChatBot';  // Import the ChatBotModal component
import SessionModal from './SessionModal';  // Import the SessionModal component
import CurrentSession from './CurrentSession';  // Import the CurrentSession component
import { useDataContext } from '../DataContext';
import { IGroup, ITrainer } from '../public/interfaces';
import AllSessions from './AllSessions';
import Administrator from '../pages/Administrator';
import useSessionStorage from '../hooks/useSessionStorage';

export function Nav_componnets() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groups, instructors, trainers, sessions , personalInstractors} =  useDataContext();
  const permmistion = useSessionStorage('permissions');
  const InstractorsComp = instructors || [];
  const trainersComp = trainers || [];
  const sessionsComp = sessions || [];
  const groupsComp = groups || [];
  const personalInstractorsComp = personalInstractors || [];


  return (
    <Navbar sticky="top" bg="light" expand="lg" className="shadow-sm mb-3 mt-0">
      <Container>
        <Navbar.Brand as={Link} to="/">Bina</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <AllSessions/>

          <Nav className="me-auto">
            <NavLink
              className="nav-link"
              to="/AddDapit"
            >Dapit</NavLink>
            <Nav.Link as={Link} to="/viewDapit">View</Nav.Link>
            <NavDropdown title="Wall" id="basic-nav-dropdown">
              {trainersComp.map((trainer: ITrainer) => (
                <NavDropdown.Item
                  key={trainer._id}
                  as={Link}
                  to={"/Wall"}
                  state={{ trainer: trainer}}
                >
                  {trainer.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Piano" id="basic-nav-dropdown">
              {groupsComp.map((group: IGroup) => (
                <NavDropdown.Item
                  key={group._id}
                  as={Link}
                  to={"/Piano"}
                  state={{ groupData: group }}
                >
                  {group.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            {permmistion && permmistion === 'admin' ? (
              <Nav.Link as={Link} to="/Admin">Admin</Nav.Link>
            ) : null}

            {/* <NavDropdown title="Megame" id="basic-nav-dropdown">
              {groupsComp.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={'/Megama'} state={{ group: item }}>
                  {item}
                </NavDropdown.Item>
              ))}
            </NavDropdown> */}
            {/* <NavDropdown title="Matrics" id="basic-nav-dropdown">
              {matricsData.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={'/Matrics'} state={{ matrics: item }}>
                  {item}
                </NavDropdown.Item>
              ))}
            </NavDropdown> */}
          </Nav>
          <ChatBotModal />  {/* Add the ChatBotModal component here */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}