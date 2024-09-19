import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import './Component/note.css';
import MainComponent from './Component/Main/MainComponent';
import LoginComponent from './Component/User/LoginComponent';
import RegisterComponent from './Component/User/RegisterComponent';
import ProtectedRoute from './Component/ProtectedRoute';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/register" element={< RegisterComponent/>} />
        <Route path="/login" element={<LoginComponent/>} />
        <Route path="/main" element={<ProtectedRoute element={<MainComponent/>}/>} />
      </Routes>
    </Router>
  );
}

export default App;
