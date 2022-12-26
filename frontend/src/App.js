import { useEffect, useState, useRef } from 'react';
import './App.css';
import { Container, Grid, MantineProvider } from '@mantine/core';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import MerchantTable from './Components/MerchantTable/MerchantTable';
import ProductTable from './Components/ProductTable/ProductTable';

function App() {
  const [left, setLeft] = useState(0);
  const [section, setSection] = useState(1);
  const [product, setProduct] = useState(<MerchantTable />)
  const contentRef = useRef(null);
  useEffect(() => {
    switch (section) {
      case 0:
        setProduct(<MerchantTable />)
        return;
      case 1:
        setProduct(<ProductTable />)
        return;
      default:
        setProduct(<MerchantTable />)
        return;
    }
  }, [section])
  
  return (
    <div className="App">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          colors:{
            blue: ["#0F1359", "#494FBF", "#4449A6", "#1A1C40", "#5E608C", "#22A2F2"]
          },
          headings:{
            fontFamily: "ProductSansBold"
          },
          fontFamily:"Product Sans"
        }}
      >
        <Navbar section={section} />
        <Grid>
          <Grid.Col span={3}>
            <Sidebar setSection={setSection} />
          </Grid.Col>
          <Grid.Col span={9} mt="150px">
            <Container ref={contentRef}>
              {product}
            </Container>
          </Grid.Col>
        </Grid>
      </MantineProvider>
    </div>
  );
}

export default App;
