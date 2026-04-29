import { redirect } from "next/navigation";

export default async function QrRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const next = typeof params.next === "string" ? params.next : null;
  const roomId = typeof params.roomId === "string" ? params.roomId : null;

  if (next && next.startsWith("/")) {
    redirect(next);
  }

  if (roomId) {
    redirect(`/booking?roomId=${encodeURIComponent(roomId)}`);
  }

  redirect("/booking");
}
