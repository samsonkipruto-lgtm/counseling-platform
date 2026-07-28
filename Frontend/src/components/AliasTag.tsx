import "../components/ui.css";

export function AliasTag({ alias }: { alias: string }) {
  return <span className="alias-badge">{alias}</span>;
}
