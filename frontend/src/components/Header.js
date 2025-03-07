import React from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
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
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
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
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-none" 
                  id="user-dropdown" 
                  className="d-flex align-items-center border-0"
                >
                  {user.avatarImage ? (
                    <img 
                      src={user.avatarImage} 
                      alt="User Avatar" 
                      className="rounded-circle me-2 border" 
                      style={{ width: "32px", height: "32px", objectFit: "cover" }} 
                    />
                  ) : (
                    <div 
                      className="bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" 
                      style={{ width: "32px", height: "32px" }}
                    >
                      <FaUser size={16} />
                    </div>
                  )}
                  <span className="d-none d-md-inline">
                    {user.name || "User"}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <LinkContainer to="/setAvatar">
                    <Dropdown.Item className="d-flex align-items-center">
                      <FaUser className="me-2" size={16} />
                      Profile
                    </Dropdown.Item>
                  </LinkContainer>                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item 
                    onClick={handleLogout}
                    className="d-flex align-items-center text-danger"
                  >
                    <FaSignOutAlt className="me-2" size={16} />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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