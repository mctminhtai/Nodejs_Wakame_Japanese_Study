import React from 'react';
import { Box, Typography,  CssBaseline, Container } from '@material-ui/core';
import Footer from './footer';


function Home() {  
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <Typography component="h1" variant="h5">
            Home
          </Typography>
        </div>
        <Box mt={8}>
          <Footer />
        </Box>
      </Container>
    );
}

export default Home;