import Sidebar from "@/components/docs/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 overflow-y-auto" data-lenis-prevent>{children}</div>
    </div>
  );
}
