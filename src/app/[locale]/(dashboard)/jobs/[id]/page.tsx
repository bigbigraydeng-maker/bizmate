export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="p-8">
      <p className="text-muted-foreground text-sm">Job {id} — Phase 2</p>
    </main>
  );
}
