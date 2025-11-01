import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaChartPie } from 'react-icons/fa';
import { FaPlusCircle, FaEdit, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import '../styles/dashboard.css';

export default function Dashboard() {

const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('token'); // remove JWT
  navigate('/login'); // redirect to login
};


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">Tela Tech Client Dashboard</div>
      <div className="dashboard-body">
        <div className="dashboard-sidebar">
            <h2>Menu</h2>
           
            <Link to="">
                <FaChartPie style={{ marginRight: '8px' }} />
                     Overview
                </Link>
            
          <Link to="add">
            <FaPlusCircle style={{ marginRight: '8px' }} />
            Add Client
          </Link>
          <Link to="edit-delete">
            <FaEdit style={{ marginRight: '8px' }} />
            Edit/Delete Client
          </Link>
          <Link to="list">
            <FaListAlt style={{ marginRight: '8px' }} />
            View Clients
          </Link>

          <div className="logout-link">
    <Link to="/">
      <FaSignOutAlt style={{ marginRight: '8px' }} />
      <button onClick={handleLogout}>
  <FaSignOutAlt style={{ marginRight: '8px' }} />
  Logout
</button>
    </Link>
    </div>
        </div>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
