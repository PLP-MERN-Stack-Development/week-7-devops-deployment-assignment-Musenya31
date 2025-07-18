import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      enqueueSnackbar('Password must be at least 6 characters long', { variant: 'error' });
      return;
    }

    setLoading(true);

    const result = await register(formData.username, formData.email, formData.password);
    
    if (result.success) {
      enqueueSnackbar('Registration successful!', { variant: 'success' });
      navigate('/');
    } else {
      setError(result.error);
      enqueueSnackbar(result.error, { variant: 'error' });
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%)',
            border: '2px solid #ff69b4',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{
              color: '#ff69b4',
              fontWeight: 'bold',
              marginBottom: 3,
              fontFamily: '"Pacifico", cursive',
            }}
          >
            ✨ Join Our Community ✨
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#ff69b4',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff69b4',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff69b4',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#ff69b4',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff69b4',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff69b4',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#ff69b4',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff69b4',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff69b4',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#ff69b4',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff69b4',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff69b4',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#ff69b4',
                '&:hover': {
                  backgroundColor: '#e91e63',
                },
                height: 48,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#ff69b4',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 