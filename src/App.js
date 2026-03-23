import { Route, Routes, Navigate } from 'react-router-dom';
import './css/App.css';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import { useContext } from 'react';
import { DContext } from './context/Datacontext';
import LoadingPage from './components/pages/Loading';
import Header from './components/blocks/Header';

function App() {
  const { isAuth, currentUser } = useContext(DContext);

  if (isAuth === null) {
    return <LoadingPage />;
  }

  return (
    <div className="container-fluid p-0">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuth ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuth ? (
              <>
                <Header />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
