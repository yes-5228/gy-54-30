import { BookOpenCheck, ClipboardList, GraduationCap, SearchCheck } from "lucide-react";

const tabs = [
  { id: "teacher", label: "成绩录入", icon: ClipboardList },
  { id: "student", label: "学生查询", icon: SearchCheck },
  { id: "appeals", label: "申诉处理", icon: BookOpenCheck },
];

export default function AppShell({ activeTab, onTabChange, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <GraduationCap size={24} />
          </div>
          <div>
            <strong>高校成绩系统</strong>
            <span>Grade Portal</span>
          </div>
        </div>
        <nav className="nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "nav-item active" : "nav-item"}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
