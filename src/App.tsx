import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GraphProvider, ThemeProvider } from './context';
import Layout from './components/Layout';
import GraphLab from './pages/GraphLab';
import Home from './pages/Home';
import Theory from './pages/Theory';

function App() {
  return (
    <ThemeProvider>
      <GraphProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="lab" element={<GraphLab />} />
              <Route path="theory" element={<Theory />} />
            </Route>
          </Routes>
        </Router>
      </GraphProvider>
    </ThemeProvider>
  );
}

export default App;
