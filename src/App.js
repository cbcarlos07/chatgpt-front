
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Chat from './pages/Chat/chat';
import LoginForm from './pages/login';
import RegisterPage from './pages/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" exact element={<RegisterPage />} />
        <Route path="/chat" exact element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
