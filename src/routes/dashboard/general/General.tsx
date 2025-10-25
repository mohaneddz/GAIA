import { Outlet } from 'react-router-dom';

export default function General() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800">General AI Dashboard</h1>
      <p className="text-gray-500">Overview of medical AI tools and diagnostics</p>
      <Outlet /> {/* SymptomAi, Diagnosis, Treatment render here */}
    </div>
  );
}
