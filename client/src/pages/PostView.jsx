// TODO: Implement modernized and streamlined post detail view, editing, and deleting

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PostView = () => {
  const { id } = useParams();
  const { get, post, loading, error, del } = useApi();
  const { user } = useAuth();
  const [postDetails, setPostDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await get(`/posts/${id}`);
      setPostDetails(data);
    } catch (err) {
      // handled by error
    }
  };

  const fetchComments = async () => {
    try {
      const data = await get(`/comments/post/${id}`);
      setComments(data);
    } catch (err) {
      // handled by error
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    setCommentLoading(true);
    try {
      await post(`/comments/post/${id}`, {
        content: commentText,
        author: user.id,
      });
      setCommentText('');
      fetchComments();
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to add comment');
    }
    setCommentLoading(false);
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await del(`/posts/${id}`);
      enqueueSnackbar('Post deleted!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      enqueueSnackbar('Failed to delete post', { variant: 'error' });
    }
    setDeleteDialogOpen(false);
  };

  if (loading && !postDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#ff69b4' }} />
      </Box>
    );
  }

  if (error && !postDetails) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!postDetails) return null;

  return (
    <Container
      maxWidth="md"
      sx={{
        flex: 1,
        minHeight: { xs: 'calc(100vh - 64px)', md: 'calc(100vh - 64px)' },
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 2, md: 4 },
      }}
    >
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, alignSelf: 'flex-start', borderRadius: 2, fontWeight: 600, color: '#e07a5f', borderColor: '#e07a5f' }}
        variant="outlined"
        aria-label="Go back"
      >
        Back
      </Button>
      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 32px rgba(224, 122, 95, 0.10)', border: '1px solid #f4a261', background: '#fff', mb: 3 }}>
        {postDetails.featuredImage && (
          <CardMedia
            component="img"
            height="360"
            image={postDetails.featuredImage}
            alt={postDetails.title}
            sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: 360 }}
          />
        )}
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={postDetails.category || 'Uncategorized'}
              size="small"
              sx={{ backgroundColor: '#f4a261', color: '#22223b', fontWeight: 500 }}
            />
          </Box>
          <Typography variant="h3" sx={{ color: '#22223b', fontWeight: 800, mb: 2, fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif', letterSpacing: '-1px' }}>
            {postDetails.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'white', width: 40, height: 40 }} aria-label="Author avatar">
              {postDetails.author?.username?.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
              By {postDetails.author?.username || 'Anonymous'} on {new Date(postDetails.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, color: '#333', whiteSpace: 'pre-line', fontSize: '1.15rem', lineHeight: 1.7 }}>
            {postDetails.content}
          </Typography>
          {user && (user.role === 'admin' || user.id === postDetails.author?._id) && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="contained" color="primary" onClick={handleEdit} aria-label="Edit post" sx={{ borderRadius: 2, fontWeight: 600, background: '#e07a5f', color: '#fff', '&:hover': { background: '#bc5b3c' } }}>Edit</Button>
              <Button variant="outlined" color="error" onClick={handleDelete} aria-label="Delete post" sx={{ borderRadius: 2, fontWeight: 600 }}>Delete</Button>
            </Box>
          )}
        </CardContent>
      </Card>
      {/* Comments Section - always visible */}
      <Box sx={{ mt: 2, background: '#fff7f0', borderRadius: 4, p: 3, boxShadow: '0 2px 12px rgba(224, 122, 95, 0.04)', border: '1px solid #f4a261' }}>
        <Typography variant="h5" sx={{ color: '#e07a5f', fontWeight: 700, mb: 2 }}>
          Comments ({comments.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {user && (
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              fullWidth
              required
              sx={{ background: '#fff', borderRadius: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={commentLoading}
              sx={{ fontWeight: 600, borderRadius: 2, background: '#e07a5f', color: '#fff', '&:hover': { background: '#bc5b3c' } }}
            >
              {commentLoading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
            </Button>
          </Box>
        )}
        {commentError && <Alert severity="error" sx={{ mb: 2 }}>{commentError}</Alert>}
        <List>
          {comments.map((comment) => (
            <ListItem alignItems="flex-start" key={comment._id} sx={{ mb: 2, borderBottom: '1px solid #f4a261', background: '#fff', borderRadius: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }} aria-label="Comment author avatar">
                  {comment.author?.username?.charAt(0).toUpperCase() || '?'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600, color: '#e07a5f' }}>{comment.author?.username || 'Anonymous'}</Typography>}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="#333">
                      {comment.content}
                    </Typography>
                    <br />
                    <Typography component="span" variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostView; 