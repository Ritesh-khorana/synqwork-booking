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
      <AdminConsole />
    </div>
  );
}
