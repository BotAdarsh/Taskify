import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NavBar from './components/NavBar';
import { Home } from './components/Home';
//curly braces is used because export is directly in it1s code. 
import About from './components/About';
import NoteState from './context/noteState';


function App() {
  return (
    <>
      <NoteState>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/about" element={<About />} />
          </Routes>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
