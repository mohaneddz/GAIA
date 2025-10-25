import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Main pages
import Home from '@/routes/Home';
import Patients from '@/routes/Patients';
import About from '@/routes/About';
import Contact from '@/routes/Contact';
import Chat from '@/routes/Chat';
import Settings from '@/routes/Settings';

// General
import Dashboard from '@/routes/dashboard/Dashboard';
import General from '@/routes/dashboard/general/General';
import SymptomAi from '@/routes/dashboard/general/SymptomAi';
import Treatment from '@/routes/dashboard/general/Treatment';
import Diagnosis from '@/routes/dashboard/general/Diagnosis';
import BloodAnalysis from '@/routes/dashboard/general/BloodAnalysis';

// Cardiology
import Cardiology from '@/routes/dashboard/cardiology/Cardiology';
import EcgAi from '@/routes/dashboard/cardiology/EcgAi';
import HeartRiskPrediction from '@/routes/dashboard/cardiology/RiskPrediction';
import LungsImaging from '@/routes/dashboard/cardiology/VisionCardio';

// Radiology
import Radiology from '@/routes/dashboard/radiology/Radiology';
import AiImaging from '@/routes/dashboard/radiology/AiImaging';
import LesionDetection from '@/routes/dashboard/radiology/LesionDetection';
import ReportGen from '@/routes/dashboard/radiology/ReportGen';

// Neurology
import Neurology from '@/routes/dashboard/neurology/Neurology';
import EegAi from '@/routes/dashboard/neurology/EegAi';
import ScanAnalyzer from '@/routes/dashboard/neurology/ScanAnalyzer';
import AiCognition from '@/routes/dashboard/neurology/AiCognition';

// Pathology
import Pathology from '@/routes/dashboard/pathology/Pathology';
import CellClassification from '@/routes/dashboard/pathology/CellClassification';
import ReportSummary from '@/routes/dashboard/pathology/ReportSummary';
import Specimen from '@/routes/dashboard/pathology/Specimen';

// Monitoring
import Monitoring from '@/routes/dashboard/monitoring/Monitoring';
import DashboardPage from '@/routes/dashboard/monitoring/DashboardPage';
import Anomaly from '@/routes/dashboard/monitoring/Anomaly';
import Insights from '@/routes/dashboard/monitoring/Insights';

// Pulmonology
import Pulmonology from '@/routes/dashboard/pulmonology/Pulmonology';
import LungFunction from '@/routes/dashboard/pulmonology/LungFunction';
import RiskPrediction from '@/routes/dashboard/pulmonology/RiskPrediction';
import Imaging from '@/routes/dashboard/pulmonology/Imaging';

function App() {
  return (
    <Router>
      <main className="center full col bg-slate-200 overflow-y-auto">
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/chat" element={<Chat />} />

          {/* Dashboard - General */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/general" element={<General />} />
          <Route path="/dashboard/general/symptom-ai" element={<SymptomAi />} />
          <Route path="/dashboard/general/diagnosis" element={<Diagnosis />} />
          <Route path="/dashboard/general/treatment" element={<Treatment />} />
          <Route path="/dashboard/general/blood-analysis" element={<BloodAnalysis />} />

          {/* Dashboard - Cardiology */}
          <Route path="/dashboard/cardiology" element={<Cardiology />} />
          <Route path="/dashboard/cardiology/ecg-ai" element={<EcgAi />} />
          <Route path="/dashboard/cardiology/risk-prediction" element={<RiskPrediction />} />
          <Route path="/dashboard/cardiology/imaging" element={<Imaging />} />

          {/* Dashboard - Radiology */}
          <Route path="/dashboard/radiology" element={<Radiology />} />
          <Route path="/dashboard/radiology/ai-imaging" element={<AiImaging />} />
          <Route path="/dashboard/radiology/lesion-detection" element={<LesionDetection />} />
          <Route path="/dashboard/radiology/report-gen" element={<ReportGen />} />

          {/* Dashboard - Neurology */}
          <Route path="/dashboard/neurology" element={<Neurology />} />
          <Route path="/dashboard/neurology/eeg-ai" element={<EegAi />} />
          <Route path="/dashboard/neurology/scan-analyzer" element={<ScanAnalyzer />} />
          <Route path="/dashboard/neurology/ai-cognition" element={<AiCognition />} />

          {/* Dashboard - Pathology */}
          <Route path="/dashboard/pathology" element={<Pathology />} />
          <Route path="/dashboard/pathology/cell-classification" element={<CellClassification />} />
          <Route path="/dashboard/pathology/report-summary" element={<ReportSummary />} />
          <Route path="/dashboard/pathology/specimen" element={<Specimen />} />

          {/* Dashboard - Monitoring */}
          <Route path="/dashboard/monitoring" element={<Monitoring />} />
          <Route path="/dashboard/monitoring/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/monitoring/anomaly" element={<Anomaly />} />
          <Route path="/dashboard/monitoring/insights" element={<Insights />} />

          {/* Dashboard - Pulmonology */}
          <Route path="/dashboard/pulmonology" element={<Pulmonology />} />
          <Route path="/dashboard/pulmonology/lung-function" element={<LungFunction />} />
          <Route path="/dashboard/pulmonology/risk-prediction" element={<HeartRiskPrediction />} />
          <Route path="/dashboard/pulmonology/imaging" element={<LungsImaging />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
