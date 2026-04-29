import AdminLoginForm from "./AdminLoginForm";

type SearchParams = { next?: string };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const nextUrl = sp?.next || "/admin";
  return <AdminLoginForm nextUrl={nextUrl} />;
}
