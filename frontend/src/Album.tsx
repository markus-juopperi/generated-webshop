import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Product from './Product';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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

let headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Origin','http://localhost:3000');
headers.append('Access-Control-Allow-Origin', '*');

const adjectives = ["great", "beautiful", "excellent", "best", "good", "awesome", "useful", "superb", "fine", "superior"]

interface MyState {
  products : Product[],
  isLoaded: boolean,
  categories: string[],
  selected_categories: string[]
}

interface MyProps {

}

class Album extends React.Component<MyProps, MyState>{

  constructor(props : MyProps) {
    super(props);
    this.state = {
      products: [],
      categories:  ["cat", "dog", "horse", "tortoise"],
      selected_categories:  ["cat", "dog", "horse", "tortoise"],
      isLoaded: false
    }
  }

  componentDidMount(): void {
    let loadedProducts: Product[] = [];
    this.state.categories.map((category) => (
      adjectives.map((adjective) => (
        fetch(
          "http://localhost:3001/products/" + adjective + "_" + category,{
            mode: "cors",
            headers: headers,
            method: "GET"
          }
          ) 
                  .then((res) => res.json())
                  .then((json) => {
                      console.log(json)
                      let product: Product = json as Product
                      loadedProducts.push(product)
                      this.setState({
                        products: loadedProducts
                      })
                      this.state.products.push(product)
                  })
        ))
    ))
    this.setState({
      isLoaded: true
    })
  }

  onChange(category: string) {
    let index: number = this.state.selected_categories.indexOf(category)
    if(index !== -1){
      this.state.selected_categories.splice(index, 1)
      this.setState({
        selected_categories: this.state.selected_categories
      })
    } else {
      this.state.selected_categories.push(category)
      this.setState({
        selected_categories: this.state.selected_categories
      })
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <CameraIcon sx={{ mr: 2 }} /> 
            <Typography variant="h6" color="inherit" noWrap>
              Album layout
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
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
                Album layout
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Something short and leading about the collection below—its contents,
                the creator, etc. Make it short and sweet, but not too short so folks
                don&apos;t simply skip over it entirely.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <FormGroup row>
                  {this.state.categories.map((category) =>(
                    <FormControlLabel key={category} control={<Checkbox checked={this.state.selected_categories.includes(category)} onChange={() => {this.onChange(category)}}/>} label={category} />
                  )
                  )}
                </FormGroup>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="xl">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {this.state.products.map((product) => (
                  <Grid item key={product.product_id} xs={12} sm={6} md={3} hidden={!this.state.selected_categories.includes(product.category_name)}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}
                  >
                    <CardMedia
                      component="img"
                      image={product.image_path}
                      alt={product.product_name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.product_name.replace("_", " ")} 
                        <br></br>
                        Price: {product.price}€
                      </Typography>
                      <Typography>
                        {product.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">View</Button>
                      <Button size="small">Edit</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p" 
          >
            Something here to give the footer a purpose!
          </Typography>
          <Copyright />
        </Box>
        {/* End footer */}
      </ThemeProvider>
    );
  }
}  
 
export default Album;