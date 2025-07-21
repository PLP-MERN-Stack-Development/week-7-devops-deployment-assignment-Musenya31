import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Suspense, lazy } from 'react';
import { SnackbarProvider } from 'notistack';
import Box from '@mui/material/Box';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PostView = lazy(() => import('./pages/PostView'));
const PostForm = lazy(() => import('./pages/PostForm'));
const Profile = lazy(() => import('./pages/Profile'));

// Create a modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e07a5f', // warm terracotta
      light: '#f4a261',
      dark: '#b35c3a',
    },
    secondary: {
      main: '#f1faee', // soft white
      light: '#f8f9fa',
      dark: '#c9ada7',
    },
    background: {
      default: '#f9f9f9',
      paper: '#fff',
    },
    text: {
      primary: '#22223b',
      secondary: '#4a4e69',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(224, 122, 95, 0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <AuthProvider>
          <Router>
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f9f9' }}>
              <Navbar />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/post/:id" element={<PostView />} />
                    <Route path="/create-post" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
                    <Route path="/edit-post/:id" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  </Routes>
                </Suspense>
              </Box>
            </Box>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
