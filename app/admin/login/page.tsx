import AdminLoginForm from "./AdminLoginForm";

export default async function AdminLoginPage(props: any) {
  const sp = await props?.searchParams; // works whether it's an object or a Promise
  const nextUrl = (sp?.next as string | undefined) || "/admin";
  return <AdminLoginForm nextUrl={nextUrl} />;
}
