import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import Notice from "../components/Notice";

const statusLabel = {
  pending: "待处理",
  approved: "已通过",
  rejected: "已驳回",
};

function formatDeadline(deadlineAt) {
  const deadline = new Date(deadlineAt);
  const now = new Date();
  const diffMs = deadline - now;
  if (diffMs <= 0) {
    const hoursOver = Math.abs(diffMs) / 3600000;
    return `已超时 ${hoursOver < 1 ? "不足1小时" : `${Math.floor(hoursOver)}小时`}`;
  }
  const hoursLeft = diffMs / 3600000;
  return `剩余 ${hoursLeft < 1 ? "不足1小时" : `${Math.floor(hoursLeft)}小时`}`;
}

export default function AppealsPage() {
  const [appeals, setAppeals] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [notice, setNotice] = useState(null);

  const loadAppeals = async () => {
    const [allAppeals, overdueData] = await Promise.all([
      api.listAppeals(),
      api.getOverdueAppeals(),
    ]);
    setAppeals(allAppeals);
    setOverdueCount(overdueData.overdueCount);
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

  const sortedAppeals = [...appeals].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>成绩申诉处理</h1>
          <p>教师查看学生申诉，并给出处理结果。</p>
        </div>
      </header>

      {overdueCount > 0 && (
        <div className="notice overdue-reminder">
          <AlertTriangle size={18} />
          <span>有 <strong>{overdueCount}</strong> 条申诉已超过处理期限，请尽快处理！</span>
        </div>
      )}

      <Notice notice={notice} />

      <div className="appeal-list">
        {sortedAppeals.map((appeal) => (
          <article
            className={`appeal-card${appeal.isOverdue ? " overdue" : ""}${appeal.status === "pending" && !appeal.isOverdue ? " pending-card" : ""}`}
            key={appeal.id}
          >
            <div>
              <div className="appeal-title">
                <strong>{appeal.courseName}</strong>
                <span className={`status ${appeal.status}`}>{statusLabel[appeal.status]}</span>
                {appeal.isOverdue && (
                  <span className="overdue-badge">
                    <AlertTriangle size={12} />
                    超时
                  </span>
                )}
              </div>
              <p>
                {appeal.studentName}（{appeal.studentNo}）当前成绩 {appeal.score} 分
              </p>
              <blockquote>{appeal.reason}</blockquote>
              {appeal.status === "pending" && (
                <div className="deadline-info">
                  <Clock size={14} />
                  <span>处理期限：{new Date(appeal.deadlineAt).toLocaleString("zh-CN")}</span>
                  <span className={appeal.isOverdue ? "deadline-overdue" : "deadline-pending"}>
                    {formatDeadline(appeal.deadlineAt)}
                  </span>
                </div>
              )}
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
