import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '@/routes/Home';
import Patients from '@/routes/Patients';
import Chat from '@/routes/Chat';
import Settings from '@/routes/Settings';
import Models from '@/routes/Models';

import Treatment from '@/routes/dashboard/general/Treatment';
import BloodAnalysis from '@/routes/dashboard/general/BloodAnalysis';
import EcgAi from '@/routes/dashboard/cardiology/EcgAi';
import HeartRiskPrediction from '@/routes/dashboard/cardiology/RiskPrediction';
import ChestXray from '@/routes/dashboard/pulmonology/ChestXray';
import EegAi from '@/routes/dashboard/neurology/EegAi';
import ScanAnalyzer from '@/routes/dashboard/neurology/ScanAnalyzer';
import AiCognition from '@/routes/dashboard/neurology/AiCognition';
import BreastUltrasound from '@/routes/dashboard/radiology/BreastUltrasound';
import CellClassification from '@/routes/dashboard/pathology/CellClassification';
import ReportSummary from '@/routes/dashboard/pathology/ReportSummary';
import Specimen from '@/routes/dashboard/pathology/Specimen';
import SkinLesion from '@/routes/dashboard/dermatology/SkinLesion';

function App() {
  return (
    <Router>
      <main className="center full col bg-slate-200 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/models" element={<Models />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/dashboard/general/treatment" element={<Treatment />} />
          <Route path="/dashboard/general/blood-analysis" element={<BloodAnalysis />} />

          <Route path="/dashboard/cardiology/ecg-ai" element={<EcgAi />} />
          <Route path="/dashboard/cardiology/risk-prediction" element={<HeartRiskPrediction />} />

          <Route path="/dashboard/pulmonology/chest-xray" element={<ChestXray />} />

          <Route path="/dashboard/neurology/eeg-ai" element={<EegAi />} />
          <Route path="/dashboard/neurology/scan-analyzer" element={<ScanAnalyzer />} />
          <Route path="/dashboard/neurology/ai-cognition" element={<AiCognition />} />

          <Route path="/dashboard/radiology/breast-ultrasound" element={<BreastUltrasound />} />

          <Route path="/dashboard/pathology/cell-classification" element={<CellClassification />} />
          <Route path="/dashboard/pathology/report-summary" element={<ReportSummary />} />
          <Route path="/dashboard/pathology/specimen" element={<Specimen />} />

          <Route path="/dashboard/dermatology/skin-lesion" element={<SkinLesion />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
