export type AdminSection = "overview" | "counselors" | "slots" | "audit";

interface AdminSidebarProps {
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
}

const NAV_ITEMS: { key: AdminSection; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "counselors", label: "Register Counselor" },
  { key: "slots", label: "Create Slot" },
  { key: "audit", label: "Audit Log" },
];

export function AdminSidebar({ active, onSelect }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <p className="admin-sidebar-title">Admin</p>
      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={
              "admin-sidebar-link" + (active === item.key ? " active" : "")
            }
            onClick={() => onSelect(item.key)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
