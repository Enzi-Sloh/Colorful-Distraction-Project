
import './App.css';
import { Router } from '@reach/router'; 
import CanvasStage from './components/canvas';
import Register from './views/Register'
import Home from './views/UserHome'
import Gallery from './views/Gallery'

function App() {
  return (
    <div className="App">
<Router>
  <Register path="/"></Register>
  <Home path="/:id/Home"></Home>
  <CanvasStage path="/:id/canvas"></CanvasStage>
  <Gallery path='/:id/gallery'></Gallery>
</Router>
    </div>
  );
}

export default App;
