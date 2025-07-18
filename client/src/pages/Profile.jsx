import { Container, Paper, Typography, Box, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%)',
            border: '2px solid #ff69b4',
            textAlign: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: '#ff69b4', color: 'white', width: 64, height: 64, mx: 'auto', mb: 2, fontSize: 32 }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" sx={{ color: '#ff69b4', fontWeight: 'bold', fontFamily: '"Pacifico", cursive', mb: 2 }}>
            {user.username}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <b>Email:</b> {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Role:</b> {user.role || 'user'}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 