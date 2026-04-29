import AdminLoginForm from "./AdminLoginForm";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp: SearchParams = await (searchParams ?? Promise.resolve({} as SearchParams));
  const nextRaw = sp["next"];
  const nextUrl = typeof nextRaw === "string" ? nextRaw : "/admin";
  return <AdminLoginForm nextUrl={nextUrl} />;
}
