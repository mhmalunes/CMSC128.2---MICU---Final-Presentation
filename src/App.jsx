import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NurseDashboard from './pages/NurseDashboard.jsx';
import PatientDetail from './pages/PatientDetail.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nurse"
        element={
          <ProtectedRoute roles={['nurse']}>
            <NurseDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nurse/patients/:patientId"
        element={
          <ProtectedRoute roles={['nurse']}>
            <PatientDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor"
        element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/patients/:patientId"
        element={
          <ProtectedRoute roles={['doctor']}>
            <PatientDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
