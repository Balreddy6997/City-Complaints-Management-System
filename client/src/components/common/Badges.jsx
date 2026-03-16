export const StatusBadge = ({ status }) => {
  const map  = { "Pending": "pending", "In Progress": "progress", "Resolved": "resolved", "Rejected": "rejected" };
  const icon = { "Pending": "🕐",      "In Progress": "⚡",       "Resolved": "✅",        "Rejected": "❌" };
  return (
    <span className={`badge badge-${map[status] || "pending"}`}>
      {icon[status]} {status}
    </span>
  );
};

export const PriorityBadge = ({ p }) => {
  const map = { Low: "low", Medium: "medium", High: "high" };
  return <span className={`badge badge-${map[p] || "low"}`}>{p}</span>;
};