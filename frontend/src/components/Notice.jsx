export default function Notice({ notice }) {
  if (!notice) {
    return null;
  }
  return <div className={`notice ${notice.type || "info"}`}>{notice.message}</div>;
}
