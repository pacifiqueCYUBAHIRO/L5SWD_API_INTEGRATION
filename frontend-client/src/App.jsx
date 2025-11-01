import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard';
import Overview from './components/Overview';
import AddClientForm from './components/AddClientForm';
import EditDeleteClient from './components/EditDeleteClient';
import ClientList from './components/ClientList';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* Landing page */}
          <Route
            path="/"
            element={
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Welcome to Tela Tech Client Manager</h1>
                <Link to="/login">
                  <button style={{ padding: '10px 20px', fontSize: '16px' }}>
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            }
          />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboard with nested routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          >
            <Route index element={<Overview />} />
            <Route path="add" element={<AddClientForm />} />
            <Route path="edit-delete" element={<EditDeleteClient />} />
            <Route path="list" element={<ClientList />} />
          </Route>
        </Routes>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
}
