import * as React from 'react';
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Stack,
  Box,
  Toolbar,
  Typography
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Product from './Product';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const headers = new Headers({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': 'http://localhost:3000',
  'Access-Control-Allow-Origin': '*'
});

const adjectives = ["great", "beautiful", "excellent", "best", "good", "awesome", "useful", "superb", "fine", "superior"];
const defaultCategories = ["cat", "dog", "horse", "tortoise"];

interface MyState {
  products: Product[];
  isLoaded: boolean;
  categories: string[];
  selected_categories: string[];
}

interface MyProps {}

class Album extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      products: [],
      categories: defaultCategories,
      selected_categories: [...defaultCategories],
      isLoaded: false
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      const loadedProducts: Product[] = [];
      const fetchPromises = this.state.categories.flatMap(category =>
        adjectives.map(adjective =>
          fetch(`http://localhost:3001/products/${adjective}_${category}`, {
            mode: "cors",
            headers,
            method: "GET"
          })
          .then(res => res.json())
          .then(json => {
            const product = json as Product;
            loadedProducts.push(product);
            return product;
          })
        )
      );

      const products = await Promise.all(fetchPromises);
      this.setState({
        products: loadedProducts,
        isLoaded: true
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      this.setState({ isLoaded: true });
    }
  }

  handleCategoryChange = (category: string): void => {
    this.setState(prevState => {
      const selected = new Set(prevState.selected_categories);
      if (selected.has(category)) {
        selected.delete(category);
      } else {
        selected.add(category);
      }
      return {
        selected_categories: Array.from(selected)
      };
    });
  }

  render() {
    const { products, categories, selected_categories } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <CameraIcon sx={{ mr: 2 }} /> 
            <Typography variant="h6" color="inherit" noWrap>
              Pet Products Catalog
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Pet Products
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Browse our selection of high-quality pet products. Filter by animal category
                to find exactly what you're looking for.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <FormGroup row>
                  {categories.map(category => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={selected_categories.includes(category)}
                          onChange={() => this.handleCategoryChange(category)}
                        />
                      }
                      label={category.charAt(0).toUpperCase() + category.slice(1)}
                    />
                  ))}
                </FormGroup>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="xl">
            <Grid container spacing={4}>
              {products.map(product => (
                <Grid
                  item
                  key={product.product_id}
                  xs={12}
                  sm={6}
                  md={3}
                  hidden={!selected_categories.includes(product.category_name)}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image_path}
                      alt={product.product_name}
                      sx={{ height: 200, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.product_name.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        €{product.price.toFixed(2)}
                      </Typography>
                      <Typography>
                        {product.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" color="primary">View Details</Button>
                      <Button size="small" variant="outlined">Add to Cart</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        <Box
          component="footer"
          sx={{
            bgcolor: 'background.paper',
            py: 6,
            mt: 'auto'
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Pet Products Store
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Quality products for your beloved pets
          </Typography>
          <Copyright />
        </Box>
      </ThemeProvider>
    );
  }
}

export default Album;