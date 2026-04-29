import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const nextUrl = searchParams?.next || "/admin";
  return <AdminLoginForm nextUrl={nextUrl} />;
}
