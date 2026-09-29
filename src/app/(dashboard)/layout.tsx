import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <Header />
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
