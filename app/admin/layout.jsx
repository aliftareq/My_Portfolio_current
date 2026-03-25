import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({ children }) {
  await auth.protect();

  const user = await currentUser();

  const allowedEmails = ["aliftareq@gmail.com"];

  const userEmails =
    user?.emailAddresses?.map((item) => item.emailAddress.toLowerCase()) || [];

  const isAllowed = userEmails.some((email) =>
    allowedEmails.includes(email)
  );

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access denied</h1>
          <p className="mb-3">
            You are signed in, but this account is not allowed to access the admin panel.
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

  return <>{children}</>;
}