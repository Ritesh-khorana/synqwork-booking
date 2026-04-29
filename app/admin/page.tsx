import { SectionHeading } from "@/components/section-heading";
import { AdminConsole } from "@/components/admin-console";

export default function AdminPage() {
  return (
    <div className="section-shell py-12 md:py-16">
      <SectionHeading
        eyebrow="Admin Panel"
        title="Operate inventory, bookings, and revenue from one view."
        description="A pragmatic MVP admin surface with room creation, editing, deletion, booking visibility, and business snapshots."
      />
      "use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { AdminConsole } from "@/components/admin-console";

export default function AdminPage() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="section-shell py-12 md:py-16">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading
          eyebrow="Admin Panel"
          title="Operate inventory, bookings, and revenue from one view."
          description="A pragmatic MVP admin surface with room creation, editing, deletion, booking visibility, and business snapshots."
        />
        <Button variant="ghost" onClick={logout}>Logout</Button>
      </div>

      <AdminConsole />
    </div>
  );
}
      <AdminConsole />
    </div>
  );
}
