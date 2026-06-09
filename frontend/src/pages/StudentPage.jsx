import { FilePlus2, Search } from "lucide-react";
import { useState } from "react";
import { api } from "../api/client";
import GradeTable from "../components/GradeTable";
import Notice from "../components/Notice";

export default function StudentPage() {
  const [studentNo, setStudentNo] = useState("20240001");
  const [transcript, setTranscript] = useState(null);
  const [appealForm, setAppealForm] = useState({ gradeId: "", reason: "" });
  const [notice, setNotice] = useState(null);

  const search = async (event) => {
    event.preventDefault();
    try {
      setTranscript(await api.getTranscript(studentNo));
      setNotice(null);
    } catch (error) {
      setTranscript(null);
      setNotice({ type: "error", message: error.message });
    }
  };

  const submitAppeal = async (event) => {
    event.preventDefault();
    try {
      await api.createAppeal({ ...appealForm, gradeId: Number(appealForm.gradeId), studentNo });
      setNotice({ type: "success", message: "申诉已提交" });
      setAppealForm({ gradeId: "", reason: "" });
      setTranscript(await api.getTranscript(studentNo));
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>学生自助查询</h1>
          <p>按学号查看成绩、总学分、平均成绩和 GPA。</p>
        </div>
        <form className="search-bar" onSubmit={search}>
          <input value={studentNo} onChange={(event) => setStudentNo(event.target.value)} placeholder="输入学号" />
          <button type="submit">
            <Search size={18} />
            查询
          </button>
        </form>
      </header>

      <Notice notice={notice} />

      {transcript && (
        <>
          <div className="metric-grid">
            <div className="metric">
              <span>学生</span>
              <strong>{transcript.student.name}</strong>
            </div>
            <div className="metric">
              <span>课程数</span>
              <strong>{transcript.summary.courseCount}</strong>
            </div>
            <div className="metric">
              <span>已获学分</span>
              <strong>{transcript.summary.passedCredit}</strong>
            </div>
            <div className="metric">
              <span>GPA</span>
              <strong>{transcript.summary.gpa}</strong>
            </div>
            <div className="metric">
              <span>平均分</span>
              <strong>{transcript.summary.averageScore}</strong>
            </div>
          </div>

          <div className="split-grid narrow">
            <div className="panel">
              <div className="panel-head">
                <h2>成绩单</h2>
              </div>
              <GradeTable compact grades={transcript.grades} />
            </div>
            <form className="panel appeal-form" onSubmit={submitAppeal}>
              <div className="panel-head">
                <h2>成绩申诉</h2>
              </div>
              <label>
                课程
                <select value={appealForm.gradeId} onChange={(event) => setAppealForm((current) => ({ ...current, gradeId: event.target.value }))} required>
                  <option value="">选择课程</option>
                  {transcript.grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.courseName} - {grade.score} 分
                    </option>
                  ))}
                </select>
              </label>
              <label>
                申诉理由
                <textarea value={appealForm.reason} onChange={(event) => setAppealForm((current) => ({ ...current, reason: event.target.value }))} required rows="6" />
              </label>
              <button className="primary-action" type="submit">
                <FilePlus2 size={18} />
                提交申诉
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
