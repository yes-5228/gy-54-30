import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import GradeTable from "../components/GradeTable";
import Notice from "../components/Notice";

const initialForm = {
  studentNo: "",
  studentName: "",
  major: "",
  className: "",
  courseCode: "",
  courseName: "",
  credit: 3,
  score: 85,
  semester: "2025-2026-2",
  teacher: "",
};

export default function TeacherPage() {
  const [form, setForm] = useState(initialForm);
  const [grades, setGrades] = useState([]);
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadGrades = async () => {
    setGrades(await api.listGrades());
  };

  useEffect(() => {
    loadGrades().catch((error) => setNotice({ type: "error", message: error.message }));
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.createGrade(form);
      setNotice({ type: "success", message: "成绩已录入" });
      setForm({ ...initialForm, teacher: form.teacher, semester: form.semester });
      await loadGrades();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const changeScore = async (gradeId, score) => {
    setGrades((items) => items.map((item) => (item.id === gradeId ? { ...item, score: Number(score) } : item)));
    try {
      const updated = await api.updateGrade(gradeId, { score });
      setGrades((items) => items.map((item) => (item.id === gradeId ? updated : item)));
    } catch (error) {
      setNotice({ type: "error", message: error.message });
      await loadGrades();
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>教师成绩录入</h1>
          <p>录入课程成绩，系统自动换算等级与绩点。</p>
        </div>
      </header>

      <Notice notice={notice} />

      <div className="split-grid">
        <form className="panel form-grid" onSubmit={submit}>
          <label>
            学号
            <input value={form.studentNo} onChange={(event) => updateField("studentNo", event.target.value)} required />
          </label>
          <label>
            姓名
            <input value={form.studentName} onChange={(event) => updateField("studentName", event.target.value)} required />
          </label>
          <label>
            专业
            <input value={form.major} onChange={(event) => updateField("major", event.target.value)} />
          </label>
          <label>
            班级
            <input value={form.className} onChange={(event) => updateField("className", event.target.value)} />
          </label>
          <label>
            课程代码
            <input value={form.courseCode} onChange={(event) => updateField("courseCode", event.target.value)} required />
          </label>
          <label>
            课程名称
            <input value={form.courseName} onChange={(event) => updateField("courseName", event.target.value)} required />
          </label>
          <label>
            学分
            <input min="0.5" step="0.5" type="number" value={form.credit} onChange={(event) => updateField("credit", event.target.value)} required />
          </label>
          <label>
            成绩
            <input min="0" max="100" type="number" value={form.score} onChange={(event) => updateField("score", event.target.value)} required />
          </label>
          <label>
            学期
            <input value={form.semester} onChange={(event) => updateField("semester", event.target.value)} required />
          </label>
          <label>
            任课教师
            <input value={form.teacher} onChange={(event) => updateField("teacher", event.target.value)} required />
          </label>
          <button className="primary-action" disabled={saving} type="submit">
            <Save size={18} />
            {saving ? "保存中" : "保存成绩"}
          </button>
        </form>

        <div className="panel">
          <div className="panel-head">
            <h2>最近成绩</h2>
          </div>
          <GradeTable grades={grades} onScoreChange={changeScore} />
        </div>
      </div>
    </section>
  );
}
