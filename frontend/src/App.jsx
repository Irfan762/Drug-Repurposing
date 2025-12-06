import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import QueryBuilder from './pages/QueryBuilder';
import AgentDashboard from './pages/AgentDashboard';
import Candidates from './pages/Candidates';
import Explainability from './pages/Explainability';
import FDAExport from './pages/FDAExport';
import { AuthProvider } from './context/AuthContext';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <OnboardingModal />
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<QueryBuilder />} />
            <Route path="/dashboard" element={<AgentDashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/explain" element={<Explainability />} />
            <Route path="/export" element={<FDAExport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
