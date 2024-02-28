import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import avatar from "../assets/avatar.jpeg";

interface NavComponnetsProps {
  isLogin: boolean;
}

export function Nav_componnets(props: NavComponnetsProps) {
  const { isLogin } = props;

  const handleLogout = () => {
    // Implement your logout logic here
    sessionStorage.clear(); // Clear the session storage
    window.dispatchEvent(new Event("sessionStorageChange")); // Trigger sessionStorageChange event
  };

  return (
    <Navbar sticky="top" className="bg-while shadow-sm mb-3 mt-0">
      <Container>
        <Nav className="me-auto">
          <Nav.Link to={"/"} as={NavLink}>
            Home
          </Nav.Link>
          <Nav.Link to={"/about"} as={NavLink}>
            About
          </Nav.Link>
          {!isLogin && (
            <Nav.Link to={"/register"} as={NavLink}>
              Register
            </Nav.Link>
          )}
          <Nav.Link to={isLogin ? "/store" : "/login"} as={NavLink}>
            {isLogin ? "Store" : "Login"}
          </Nav.Link>
        </Nav>
        <Nav className="me-2">
          {isLogin && (
            <>
              <Nav.Link to={"/personal"} as={NavLink}>
                <img
                  className="rounded-circle"
                  src={avatar}
                  alt="Avatar"
                  style={{ width: "30px" }}
                />
              </Nav.Link>
              <Nav.Link disabled className="me-2"> {/* Empty Nav.Link for spacing */}
                &nbsp;
              </Nav.Link>
              <Button variant="outline-primary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
