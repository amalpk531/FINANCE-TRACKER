import React from "react";
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaUserEdit } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Load user data from localStorage on component mount
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("user");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">
            <span className="text-primary">Finance</span>Tracker
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {user ? (
              <NavDropdown 
                title={
                  <div className="d-inline-flex align-items-center">
                    {user.avatarImage ? (
                      <Image 
                        src={user.avatarImage} 
                        alt="User Avatar" 
                        width={32} 
                        height={32} 
                        className="rounded-circle me-2 border" 
                      />
                    ) : (
                      <div className="bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                        <FaUser size={16} />
                      </div>
                    )}
                    <span>{user.username || "User"}</span>
                  </div>
                } 
                id="user-dropdown"
                align="end"
              >
                <LinkContainer to="/profile">
                  <NavDropdown.Item className="d-flex align-items-center">
                    <FaUser className="me-2" size={16} />
                    Profile
                  </NavDropdown.Item>
                </LinkContainer>
                
                <LinkContainer to="/setAvatar">
                  <NavDropdown.Item className="d-flex align-items-center">
                    <FaUserEdit className="me-2" size={16} />
                    Change Avatar
                  </NavDropdown.Item>
                </LinkContainer>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Item 
                  onClick={handleLogout}
                  className="d-flex align-items-center text-danger"
                >
                  <FaSignOutAlt className="me-2" size={16} />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;