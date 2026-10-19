import { createLucideIcon, type LucideProps } from "lucide-react";

const LogoIcon = createLucideIcon("my-corpora-logo", [
  ["path",{"d":"M11 7v10","key":"pptsnr"}],
  ["path",{"d":"m15 7 2 10","key":"1m7qm5"}],
  ["path",{"d":"M19 9a2.5 2.5 0 113.3 2.36c-.8.3-1.3.8-1.3 1.64","key":"avz7la"}],
  ["path",{"d":"M21 16.5h.01","key":"1e59ja"}],
  ["path",{"d":"M7 7v10","key":"d5nglc"}],
  ["rect",{"x":"3","y":"3","width":"24","height":"18","rx":"2","key":"12g97j"}]
]);

export function MyCorporaIcon(props: LucideProps) {
  return <LogoIcon viewBox="0 0 30 24" {...props} />;
}