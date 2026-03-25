// import AdminSidebar from "@/components/admin/AdminSidebar.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";

export default function AdminPage() {
  return (
    <div className="min-h-screen lg:flex">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-2xl lg:text-4xl font-bold mb-3">Admin Dashboard</h1>
        <p className="text-white/70 mb-8">
          Welcome to your portfolio admin panel.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-white/70">
              Update your profile details, intro, and personal information.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <p className="text-white/70">
              Add, edit, and manage your portfolio projects from here.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Contacts</h3>
            <p className="text-white/70">
              Manage contact messages and communication details.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}