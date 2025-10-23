import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';

interface Collection {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default function CollectionDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchCollection();
      fetchAvailableProducts();
    }
  }, [id]);

  const fetchCollection = async () => {
    try {
      const response = await api.get(`/collections/${id}`);
      setCollection(response.data.data);
    } catch (error) {
      console.error('Error fetching collection:', error);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const response = await api.get('/products');
      const allProducts = response.data.data;
      const collectionProducts = collection?.products || [];
      const available = allProducts.filter(
        (p: Product) => !collectionProducts.some((cp: Product) => cp.id === p.id)
      );
      setAvailableProducts(available);
    } catch (error) {
      console.error('Error fetching available products:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = async (productId: number) => {
    try {
      await api.post(`/collections/${id}/products/${productId}`);
      handleCloseDialog();
      fetchCollection();
      fetchAvailableProducts();
    } catch (error) {
      console.error('Error adding product to collection:', error);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to remove this product from the collection?')) {
      try {
        await api.delete(`/collections/${id}/products/${productId}`);
        fetchCollection();
        fetchAvailableProducts();
      } catch (error) {
        console.error('Error removing product from collection:', error);
      }
    }
  };

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              {collection.name} - Products
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Add Products
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collection.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add Products to Collection</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddProduct(product.id)}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 