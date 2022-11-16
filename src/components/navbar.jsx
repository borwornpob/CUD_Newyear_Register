import { useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Navbar
      expanded={expanded}
      bg="light"
      variant="light"
      sticky="top"
      expand="md"
    >
      <Container>
        <Navbar.Brand>CUD Newyear Registration</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Register
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/tickets"
              onClick={() => setExpanded(false)}
            >
              Find my ticket
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
