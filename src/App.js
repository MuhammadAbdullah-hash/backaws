import logo from './logo.svg';
import './App.css';
// import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomeComp from './components/homePage';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomeComp />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
