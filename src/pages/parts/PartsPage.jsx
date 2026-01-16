import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { partAPI } from '../../services/api';

const PartsPage = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    partNumber: '',
    category: '',
    manufacturer: '',
    cost: '',
  });

  // Fetch parts on component mount
  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await partAPI.getAll();
      setParts(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch parts';
      setError(errorMsg);
      console.error('Error fetching parts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (part = null) => {
    if (part) {
      setEditingPart(part);
      setFormData({
        name: part.name || '',
        description: part.description || '',
        partNumber: part.partNumber || '',
        category: part.category || '',
        manufacturer: part.manufacturer || '',
        cost: part.cost || '',
      });
    } else {
      setEditingPart(null);
      setFormData({
        name: '',
        description: '',
        partNumber: '',
        category: '',
        manufacturer: '',
        cost: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPart(null);
    setFormData({
      name: '',
      description: '',
      partNumber: '',
      category: '',
      manufacturer: '',
      cost: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePart = async () => {
    try {
      setError('');
      setSuccess('');

      // Validation
      if (!formData.name || !formData.partNumber) {
        setError('Name and Part Number are required');
        return;
      }

      setLoading(true);

      if (editingPart?.id) {
        // Update existing part
        await partAPI.update(editingPart.id, formData);
        setSuccess('Part updated successfully!');
      } else {
        // Create new part
        await partAPI.create(formData);
        setSuccess('Part created successfully!');
      }

      handleCloseDialog();
      fetchParts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save part';
      setError(errorMsg);
      console.error('Error saving part:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePart = async (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        setError('');
        setSuccess('');
        setLoading(true);
        await partAPI.delete(id);
        setSuccess('Part deleted successfully!');
        fetchParts();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete part';
        setError(errorMsg);
        console.error('Error deleting part:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewPart = (part) => {
    navigate(`/parts/${part.id}`, { state: { part } });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedParts = parts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#003d5c' }}>
          Parts Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ textTransform: 'none', fontSize: '1rem' }}
        >
          Create New Part
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Loading State */}
      {loading && parts.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Parts Table */}
      {!loading && parts.length > 0 && (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#003d5c' }}>Part Number</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#003d5c' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#003d5c' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#003d5c' }}>Manufacturer</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#003d5c' }}>Cost</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#003d5c' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedParts.map((part) => (
                  <TableRow key={part.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {part.partNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{part.name}</TableCell>
                    <TableCell>
                      {part.category && (
                        <Chip label={part.category} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                      )}
                    </TableCell>
                    <TableCell>{part.manufacturer || 'N/A'}</TableCell>
                    <TableCell align="right">
                      {part.cost ? `$${parseFloat(part.cost).toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPart(part)}
                        title="View Details"
                        sx={{ color: '#003d5c' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(part)}
                        title="Edit"
                        sx={{ color: '#f57c00' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePart(part.id)}
                        title="Delete"
                        sx={{ color: '#d32f2f' }}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={parts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Empty State */}
      {!loading && parts.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography color="textSecondary" sx={{ mb: 2 }}>
            No parts found. Create your first part to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create First Part
          </Button>
        </Paper>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#003d5c', color: 'white', fontWeight: 700 }}>
          {editingPart ? 'Edit Part' : 'Create New Part'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Part Number"
            name="partNumber"
            value={formData.partNumber}
            onChange={handleInputChange}
            margin="normal"
            required
            placeholder="e.g., PLM-2024-001"
          />
          <TextField
            fullWidth
            label="Part Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
            placeholder="e.g., Steel Bearing"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
            placeholder="Enter part description"
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            margin="normal"
            placeholder="e.g., Hardware"
          />
          <TextField
            fullWidth
            label="Manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            margin="normal"
            placeholder="e.g., Acme Corp"
          />
          <TextField
            fullWidth
            label="Cost"
            name="cost"
            value={formData.cost}
            onChange={handleInputChange}
            margin="normal"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            placeholder="e.g., 99.99"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSavePart}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartsPage;