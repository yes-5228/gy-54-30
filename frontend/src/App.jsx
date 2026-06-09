import { useState } from "react";
import AppShell from "./components/AppShell";
import AppealsPage from "./pages/AppealsPage";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("teacher");

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "teacher" && <TeacherPage />}
      {activeTab === "student" && <StudentPage />}
      {activeTab === "appeals" && <AppealsPage />}
    </AppShell>
  );
}
