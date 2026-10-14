import CorporaCard from "../corpora/corpora-card";
import DocumentsCard from "../documents/documents-card";
import SettingsCard from "../settings/settings-card";

export default function SideBar() {
  return (
    <div className="flex flex-col gap-8">
      <DocumentsCard />
      <CorporaCard />
      <SettingsCard />
    </div>
  );
}
