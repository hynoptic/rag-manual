import DocumentsCard from "../documents/documents-card";
import SettingsPanel from "../settings/settings-panel";

export default function SideBar() {
  return (
    <div className="flex flex-col gap-8">
      <DocumentsCard />
      <SettingsPanel />
    </div>
  );
}
