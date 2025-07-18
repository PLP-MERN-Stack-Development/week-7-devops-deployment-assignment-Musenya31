import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  CardActions,
} from '@mui/material';
import { Favorite, FavoriteBorder, Search } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const { get, post, put, delete: del, loading, error } = useApi();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [page, search, selectedCategory]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
      });
      
      const response = await get(`/posts?${params}`);
      setPosts(response.posts);
      setTotalPages(response.pages);
      setTotalPosts(response.total);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleAccordionChange = (postId) => async (event, isExpanded) => {
    setExpandedPostId(isExpanded ? postId : null);
    if (isExpanded && !commentsMap[postId]) {
      try {
        const comments = await get(`/comments/post/${postId}`);
        setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
      } catch (err) {
        setCommentsMap((prev) => ({ ...prev, [postId]: [] }));
      }
    }
  };

  const handleDelete = (postId) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await del(`/posts/${postToDelete}`);
      enqueueSnackbar('Post deleted successfully!', { variant: 'success' });
      fetchPosts();
    } catch (err) {
      enqueueSnackbar(error || 'Failed to delete post', { variant: 'error' });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Extract unique categories from posts
  const uniqueCategories = Array.from(new Set(posts.map(post => post.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container disableGutters sx={{ minHeight: '100vh', bgcolor: '#F8F5F2', color: '#5C4037', pb: 4, width: '100vw', maxWidth: '100vw !important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 4, pt: 4, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#7C5E3C', letterSpacing: 1 }}>Warm Stories</Typography>
        <Button component={Link} to="/create-post" variant="contained" color="primary" sx={{ bgcolor: '#EAD7C2', color: '#7C5E3C', boxShadow: '0 2px 8px #EAD7C2', '&:hover': { bgcolor: '#F3E9DD' } }}>New Post</Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, px: 4, maxWidth: 1200, mx: 'auto' }}>
        <TextField
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{
            input: { bgcolor: '#F3E9DD', color: '#5C4037' },
            label: { color: '#A68A64' },
            borderRadius: 2,
          }}
          InputLabelProps={{ style: { color: '#A68A64' } }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: '#A68A64' }}>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={e => setSelectedCategory(e.target.value)}
            sx={{ bgcolor: '#F3E9DD', color: '#5C4037', borderRadius: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            {[...new Set(posts.map(p => p.category).filter(Boolean))].map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress sx={{ color: '#A68A64' }} /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ bgcolor: '#F3E9DD', color: '#B85C38', border: '1px solid #EAD7C2' }}>{error}</Alert>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Grid container spacing={2} sx={{ width: '100%', maxWidth: 1200, mx: 'auto', py: 2, flexWrap: 'wrap', flexDirection: 'row' }}>
            {posts.map(post => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={post._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ bgcolor: '#FFF8F0', boxShadow: '0 2px 12px #EAD7C2', borderRadius: 2, p: 0, position: 'relative', width: 220, minWidth: 180, maxWidth: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: '0.2s', '&:hover': { boxShadow: '0 6px 24px #EAD7C2' } }}>
                  <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', borderTopLeftRadius: 8, borderTopRightRadius: 8, bgcolor: '#F3E9DD' }}>
                    {post.featuredImage ? (
                      <CardMedia
                        component="img"
                        image={post.featuredImage}
                        alt={post.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8, transition: '0.2s', filter: 'brightness(0.97)' }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', bgcolor: '#EAD7C2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#A68A64' }}>
                        No Image
                      </Box>
                    )}
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', bgcolor: 'rgba(0,0,0,0.32)', color: '#FFF', px: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', textShadow: '0 1px 4px #000', lineHeight: 1.1 }}>{post.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#F3E9DD', textShadow: '0 1px 4px #000', fontSize: '0.75rem', lineHeight: 1 }}>{post.category}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', py: 1 }}>
                    <Typography variant="caption" color="#A68A64" sx={{ fontSize: '0.8rem', mb: 0.5 }}>By {post.author?.username || 'Unknown'}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, width: '100%' }}>
                      {(user && (user.role === 'admin' || user.id === post.author?._id)) && (
                        <>
                          <Button component={Link} to={`/edit-post/${post._id}`} size="small" sx={{ color: '#B85C38', minWidth: 0, px: 1, fontSize: '0.8rem' }}>Edit</Button>
                          <Button color="error" size="small" onClick={() => handleDelete(post._id)} sx={{ color: '#B85C38', minWidth: 0, px: 1, fontSize: '0.8rem' }}>Delete</Button>
                        </>
                      )}
                      <Button component={Link} to={`/post/${post._id}`} size="small" sx={{ color: '#A68A64', minWidth: 0, px: 1, fontSize: '0.8rem' }}>View</Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" sx={{
          '& .MuiPaginationItem-root': { color: '#A68A64' },
          '& .Mui-selected': { bgcolor: '#EAD7C2 !important', color: '#B85C38 !important' },
        }} />
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ bgcolor: '#F3E9DD', color: '#B85C38' }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ bgcolor: '#F3E9DD', color: '#5C4037' }}>
          <DialogContentText sx={{ color: '#A68A64' }}>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#F3E9DD' }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary" disabled={deleting} sx={{ color: '#A68A64' }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus disabled={deleting} sx={{ color: '#B85C38' }}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home; 