import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { StaffAuthProvider, useStaffAuth } from "../../admin/auth";
import { Input } from "../../components/ui/form";
import { Button } from "../../components/ui/Button";
import { SITE } from "../../lib/config";

function LoginForm() {
  const { signIn, session, profile, loading } = useStaffAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (!loading && session && profile) return <Navigate to="/admin" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn(email.trim(), password);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    navigate("/admin", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest px-5">
      <div className="w-full max-w-md border border-ivory/15 bg-forest-2/70 p-10">
        <div className="text-center">
          <h1 className="font-display text-3xl text-brass">Igloos · Staff</h1>
          <p className="mt-3 text-sm text-ivory/60">
            Reservations dashboard sign-in. Accounts are provisioned by a restaurant
            administrator.
          </p>
        </div>
        <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@restaurant.in"
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" loading={busy} className="w-full" size="lg">
            Sign in
          </Button>
          {error && (
            <p role="alert" className="rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
        </form>
        {SITE.isPlaceholder && (
          <p className="mt-8 text-center text-xs text-ivory/40">
            Staff accounts are created in Supabase Auth and linked in the staff_profiles table —
            see docs/SETUP.md.
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <StaffAuthProvider>
      <LoginForm />
    </StaffAuthProvider>
  );
}
