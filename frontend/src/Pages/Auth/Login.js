import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

// MUI imports
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  CircularProgress,
  FormHelperText
} from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let tempErrors = {
      email: "",
      password: "",
    };
    let isValid = true;

    // Email validation
    if (!values.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!values.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the form errors", toastOptions);
      return;
    }
    
    const { email, password } = values;
    setLoading(true);

    try {
      const { data } = await axios.post(loginAPI, {
        email,
        password,
      });

      if (data.success === true) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        toast.success(data.message, toastOptions);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, toastOptions);
      } else {
        toast.error("An error occurred", toastOptions);
      }
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Particle load handling if needed
  }, []);

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#f5f5f5",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 200,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#1976d2",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.3,
              random: true,
            },
            size: {
              value: 3,
              random: { enable: true, minimumValue: 1 },
            },
            links: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 2,
            },
            life: {
              duration: {
                sync: false,
                value: 3,
              },
              count: 0,
              delay: {
                random: {
                  enable: true,
                  minimumValue: 0.5,
                },
                value: 1,
              },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: 1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Container maxWidth="sm" sx={{ pt: 8, position: "relative", zIndex: 2 }}>
        <Paper 
          elevation={3} 
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "rgba(255, 255, 255, 0.9)"
          }}
        >
          <AccountBalanceWallet sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Login
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={values.email}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
            
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <MuiLink 
                component={Link} 
                to="/forgotPassword"
                sx={{ mb: 2 }}
              >
                Forgot Password?
              </MuiLink>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>

              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <MuiLink component={Link} to="/register">
                  Register
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      <ToastContainer />
    </Box>
  );
};

export default Login;