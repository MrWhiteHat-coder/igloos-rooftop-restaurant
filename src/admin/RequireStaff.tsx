import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { StaffAuthProvider, useStaffAuth } from "./auth";
import { Spinner } from "../components/ui/misc";
import { Button } from "../components/ui/Button";

function Guard({ children }: { children: ReactNode }) {
  const { loading, session, profile, signOut } = useStaffAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest">
        <Spinner label="Checking access" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-forest px-5 text-center">
        <h1 className="font-display text-3xl text-brass">Not authorised</h1>
        <p className="max-w-md text-sm text-ivory/65">
          You are signed in as <span className="text-ivory">{session.user.email}</span>, but this
          account is not on the list of active restaurant staff. Ask an administrator to add a
          staff profile for this account.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
          <Button variant="ghost" onClick={() => window.location.assign("/")}>
            Back to site
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function RequireStaff({ children }: { children: ReactNode }) {
  return (
    <StaffAuthProvider>
      <Guard>{children}</Guard>
    </StaffAuthProvider>
  );
}
