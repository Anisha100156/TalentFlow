import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { NotFound } from "./components/NotFound";

import RecruiterDashboard from "./components/RecruiterDashboard";

import { Toaster } from "@/components/ui/toaster";
import ViewJob from "./pages/ViewJob";
import AssessmentBuilder from "./pages/AssessmentBuilder";
import KanbanBoard from "./pages/KanbanBoard";
import HRDashboard from "./components/RecruiterDashboard";
import AssessmentPage from "./pages/AssessmentPage";
import CandidatesDashboard from "./pages/candidates";
import CandidateDashboard from "./components/CandidateDashBoard";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/recruiter" element={<HRDashboard />} />
          <Route path="/view-job/:id" element={<ViewJob />} />
          <Route path="/assessment-builder" element={<AssessmentBuilder />} />
          <Route path="/assessment/:jobId" element={<AssessmentPage />} />
          <Route path="/kanban-board" element={<KanbanBoard />} />
          <Route path="/jobs/:jobId" element={<ViewJob />} />
          <Route path="/candidates" element={<CandidatesDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;