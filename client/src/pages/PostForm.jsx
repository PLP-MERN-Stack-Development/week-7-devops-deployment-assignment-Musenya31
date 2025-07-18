// TODO: Implement modernized and streamlined post creation/editing form

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  CircularProgress,
  Alert,
  InputLabel,
  Select,
  FormControl,
} from '@mui/material';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const PostForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { get, post, put, loading, error } = useApi();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', category: '', featuredImage: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      get(`/posts/${id}`).then(data => {
        setForm({
          title: data.title || '',
          content: data.content || '',
          category: data.category || '',
          featuredImage: data.featuredImage || ''
        });
      });
    }
    // eslint-disable-next-line
  }, [id]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        await put(`/posts/${id}`, form);
        enqueueSnackbar('Post updated!', { variant: 'success' });
      } else {
        await post('/posts', { ...form, author: user.id });
        enqueueSnackbar('Post created!', { variant: 'success' });
      }
      navigate('/');
    } catch (err) {
      enqueueSnackbar('Failed to submit post', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">{isEdit ? 'Edit Post' : 'New Post'}</Typography>
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} required fullWidth />
        <TextField label="Content" name="content" value={form.content} onChange={handleChange} required fullWidth multiline minRows={4} />
        <TextField label="Category" name="category" value={form.category} onChange={handleChange} required fullWidth select>
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="Tech">Tech</MenuItem>
          <MenuItem value="Life">Life</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField label="Featured Image URL" name="featuredImage" value={form.featuredImage} onChange={handleChange} fullWidth />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" color="primary" disabled={submitting || loading}>{submitting ? <CircularProgress size={24} /> : isEdit ? 'Update' : 'Create'}</Button>
      </Box>
    </Container>
  );
};

export default PostForm; 