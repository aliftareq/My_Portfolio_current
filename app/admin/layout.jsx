import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";

export default async function AdminLayout({ children }) {
  await auth.protect();

  const user = await currentUser();

  const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

  const userEmails =
    user?.emailAddresses?.map((item) => item.emailAddress.toLowerCase()) || [];

  const isAllowed = userEmails.includes(allowedEmail);

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access denied</h1>
          <p className="mb-3">
            You are signed in, but this account is not allowed to access the
            admin panel.
          </p>
          <p className="mb-6">
            Please sign out and log in with the correct admin account.
          </p>

          <div className="flex justify-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
