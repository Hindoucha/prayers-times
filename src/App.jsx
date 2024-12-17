import './App.css'
import MainContent from './MainContent';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './components/theme';

function App() {

  return (
    <>
      <ThemeProvider theme={Theme}>
        <div 
          style={{
            display: 'flex', 
            justifyContent:'center', 
            width:"100vw" 
          }}>
            <Container maxWidth="lg" >
              <MainContent />
            </Container>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
