const statusMap = {
  pending: "待处理",
  approved: "已通过",
  rejected: "已驳回",
};

export default function GradeTable({ grades, compact = false, onScoreChange }) {
  if (!grades.length) {
    return <div className="empty">暂无成绩记录</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {!compact && <th>学号</th>}
            {!compact && <th>姓名</th>}
            <th>课程</th>
            <th>学期</th>
            <th>学分</th>
            <th>成绩</th>
            <th>绩点</th>
            <th>等级</th>
            <th>申诉</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id}>
              {!compact && <td>{grade.student.studentNo}</td>}
              {!compact && <td>{grade.student.name}</td>}
              <td>
                <strong>{grade.courseName}</strong>
                <span>{grade.courseCode}</span>
              </td>
              <td>{grade.semester}</td>
              <td>{grade.credit}</td>
              <td>
                {onScoreChange ? (
                  <input
                    className="score-input"
                    min="0"
                    max="100"
                    type="number"
                    value={grade.score}
                    onChange={(event) => onScoreChange(grade.id, event.target.value)}
                  />
                ) : (
                  grade.score
                )}
              </td>
              <td>{grade.gpaPoint.toFixed(1)}</td>
              <td>{grade.letter}</td>
              <td>
                {grade.appealStatus ? (
                  <span className={`status ${grade.appealStatus}`}>{statusMap[grade.appealStatus]}</span>
                ) : (
                  <span className="muted">无</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
