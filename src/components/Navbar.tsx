import {Container, Navbar, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import avatar from "../assets/avatar.jpeg";
import { useState } from "react";

export function Nav_componnets() {
    const [imgSrc, setImgSrc] = useState<File>()


    return (
       <Navbar  sticky="top" className ="bg-while shadow-sm mb-3">
        <Container>
            <Nav className="me-auto">
                <Nav.Link to={"/"} as={NavLink}>
                    Home
                </Nav.Link>
                <Nav.Link to={"/about"} as={NavLink}>
                    About
                </Nav.Link>
                <Nav.Link to={"/register"} as={NavLink}>
                    Register
                </Nav.Link>
                <Nav.Link to={"/login"} as={NavLink}>
                    Login
                </Nav.Link>
                <Nav.Link to={"/store"} as={NavLink}>
                    Store
                </Nav.Link>
            </Nav>
            <Nav.Link to={"/personal"} as={NavLink}>
                <img className="rounded-circle" src={imgSrc ? URL.createObjectURL(imgSrc) : avatar} alt="aa" style={{width: "30px"}} />
            </Nav.Link>
        </Container>
       </Navbar>
    );
}
