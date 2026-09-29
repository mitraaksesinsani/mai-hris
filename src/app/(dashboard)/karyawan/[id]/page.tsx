import { EmployeeDetailClient } from "./client-detail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <EmployeeDetailClient id={id} />;
}
