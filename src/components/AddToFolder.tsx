import { Folder } from "lucide-react";
import { useState, useEffect } from "react";

interface AddToFolderProps {
  currentPage: string;
}

const featureMap: Record<string, string> = {
  "/": "Clinic Statistics",
  "/about": "About",
  "/contact": "Contact",
  "/settings": "Settings",
  "/patients": "Patients",
  "/chat": "Chat",
  "/dashboard": "Dashboard",
  "/dashboard/general": "General Medicine",
  "/dashboard/general/symptom-ai": "Symptom Analyzer (AI)",
  "/dashboard/general/diagnosis": "Diagnosis Suggestions",
  "/dashboard/general/treatment": "Treatment Recommendations",
  "/dashboard/cardiology": "Cardiology",
  "/dashboard/cardiology/ecg-ai": "ECG Interpretation (AI)",
  "/dashboard/cardiology/risk-prediction": "Heart Risk Prediction",
  "/dashboard/cardiology/imaging": "Imaging Utility",
  "/dashboard/radiology": "Radiology",
  "/dashboard/radiology/ai-imaging": "X-ray / MRI Analysis (AI)",
  "/dashboard/radiology/lesion-detection": "Lesion Detection",
  "/dashboard/radiology/report-gen": "Image Reports Generator",
  "/dashboard/neurology": "Neurology",
  "/dashboard/neurology/eeg-ai": "ECG Pattern Recognition",
  "/dashboard/neurology/scan-analyzer": "Brain Scan Analyzer",
  "/dashboard/neurology/ai-cognition": "Cognitive Assessment Tools",
  "/dashboard/pathology": "Pathology",
  "/dashboard/pathology/cell-classification": "Cell Image Classifier",
  "/dashboard/pathology/report-summary": "Report Summarizer (AI)",
  "/dashboard/pathology/specimen": "Specimen Tracker",
  "/dashboard/monitoring": "Monitoring & Analytics",
  "/dashboard/monitoring/dashboard": "Patient Data Dashboard",
  "/dashboard/monitoring/anomaly": "Anomaly Detection (AI)",
  "/dashboard/monitoring/insights": "Performance Insights",
  "/dashboard/pulmonology": "Pulmonology",
  "/dashboard/pulmonology/lung-function": "Lung Function Analysis (AI)",
  "/dashboard/pulmonology/risk-prediction": "Heart Risk Prediction",
  "/dashboard/pulmonology/imaging": "Imaging Utility",
};

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export default function AddToFolder({ currentPage }: AddToFolderProps) {
  const [addedPages, setAddedPages] = useState<string[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const stored = getCookie('addedPages');
    if (stored) {
      try {
        setAddedPages(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing cookie:', e);
      }
    }
  }, []);

  useEffect(() => {
    setCookie('addedPages', JSON.stringify(addedPages));
  }, [addedPages]);

  const isAdded = addedPages.includes(currentPage);

  const handleClick = () => {
    if (isAdded) {
      setAddedPages(addedPages.filter((page) => page !== currentPage));
    } else {
      setAddedPages([...addedPages, currentPage]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {showList && addedPages.length > 0 && (
        <div className="absolute w-max bottom-full left-1/2 translate-x-[-50%] mb-2 right-0 bg-white border border-gray-300 rounded shadow-lg p-2 max-w-xs z-10">
          <ul className="list-disc list-inside text-sm">
            {addedPages.map((page, index) => (
              <li key={index}>{featureMap[page] || page}</li>
            ))}
          </ul>
        </div>
      )}
      <div
        className="rounded-full bg-blue-600 text-white px-4 py-2 shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
        onClick={handleClick}
        onMouseEnter={() => setShowList(true)}
        onMouseLeave={() => setShowList(false)}
      >
        <Folder className="w-4 h-4 mr-2 inline" />
        {isAdded ? "Remove from Folder" : "Add to Folder"}
      </div>
    </div>
  );
};
