import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AnimalList from './components/AnimalList';
import AnimalForm from './components/AnimalForm';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/animals"
              element={
                <ProtectedRoute>
                  <AnimalList />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/animals/new"
              element={
                <ProtectedRoute>
                  <AnimalForm />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/animals/edit/:id"
              element={
                <ProtectedRoute>
                  <AnimalForm />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
