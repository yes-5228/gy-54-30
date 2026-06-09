import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import Notice from "../components/Notice";

const statusLabel = {
  pending: "待处理",
  approved: "已通过",
  rejected: "已驳回",
};

export default function AppealsPage() {
  const [appeals, setAppeals] = useState([]);
  const [notice, setNotice] = useState(null);

  const loadAppeals = async () => {
    setAppeals(await api.listAppeals());
  };

  useEffect(() => {
    loadAppeals().catch((error) => setNotice({ type: "error", message: error.message }));
  }, []);

  const decide = async (appeal, status) => {
    const teacherResponse = status === "approved" ? "已复核，申诉通过。" : "已复核，原成绩无误。";
    try {
      await api.updateAppeal(appeal.id, { status, teacherResponse });
      setNotice({ type: "success", message: "申诉状态已更新" });
      await loadAppeals();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>成绩申诉处理</h1>
          <p>教师查看学生申诉，并给出处理结果。</p>
        </div>
      </header>
      <Notice notice={notice} />
      <div className="appeal-list">
        {appeals.map((appeal) => (
          <article className="appeal-card" key={appeal.id}>
            <div>
              <div className="appeal-title">
                <strong>{appeal.courseName}</strong>
                <span className={`status ${appeal.status}`}>{statusLabel[appeal.status]}</span>
              </div>
              <p>
                {appeal.studentName}（{appeal.studentNo}）当前成绩 {appeal.score} 分
              </p>
              <blockquote>{appeal.reason}</blockquote>
              {appeal.teacherResponse && <p className="response">{appeal.teacherResponse}</p>}
            </div>
            <div className="appeal-actions">
              <button disabled={appeal.status !== "pending"} onClick={() => decide(appeal, "approved")} type="button">
                <CheckCircle2 size={18} />
                通过
              </button>
              <button disabled={appeal.status !== "pending"} onClick={() => decide(appeal, "rejected")} type="button">
                <XCircle size={18} />
                驳回
              </button>
            </div>
          </article>
        ))}
        {!appeals.length && <div className="empty">暂无申诉记录</div>}
      </div>
    </section>
  );
}
