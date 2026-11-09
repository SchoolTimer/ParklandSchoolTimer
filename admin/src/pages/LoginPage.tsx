import { useState } from "react";
import { useAuth } from "../lib/auth";

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l6.3 5.3C37.4 38.4 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

export function LoginPage() {
  const { signInWithGoogle, signUpWithGoogle, gateError, clearGateError } =
    useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(gateError);
  const [loading, setLoading] = useState(false);

  const shownError = error || gateError;

  const run = async (action: () => Promise<string | null>) => {
    setLoading(true);
    setError(null);
    clearGateError();
    const err = await action();
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-dim uppercase tracking-widest leading-none">
              Parkland HS
            </p>
            <p className="text-base font-bold text-text leading-none mt-0.5">
              Admin Portal
            </p>
          </div>
        </div>

        {mode === "in" ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-dim leading-relaxed">
              Sign in with the Google account that was invited to this portal.
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={() => run(signInWithGoogle)}
              className="flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <GoogleMark />
              <span className={loading ? "text-accent" : "text-neutral-900"}>
                {loading ? "Redirecting…" : "Sign in with Google"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("up");
                setError(null);
                clearGateError();
              }}
              className="text-xs font-semibold text-dim hover:text-text"
            >
              Have an invite code? Create an account
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(() => signUpWithGoogle(code, email));
            }}
            className="flex flex-col gap-4"
          >
            <p className="text-sm text-dim leading-relaxed">
              Enter your invite code and the Google email you will use. New
              accounts are only created from a valid code.
            </p>
            <div>
              <label className="block text-xs font-semibold text-dim mb-1.5">
                Invite code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                  clearGateError();
                }}
                className={`w-full px-3 py-2.5 rounded-xl border bg-surface-2 text-sm text-text placeholder:text-dim tracking-widest ${
                  shownError ? "border-danger" : "border-border"
                }`}
                placeholder="PHS-XXXX-XXXX"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dim mb-1.5">
                Google email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                  clearGateError();
                }}
                className={`w-full px-3 py-2.5 rounded-xl border bg-surface-2 text-sm text-text placeholder:text-dim ${
                  shownError ? "border-danger" : "border-border"
                }`}
                placeholder="name@gmail.com"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={!code.trim() || !email.trim() || loading}
              className="flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-white text-sm font-bold text-neutral-900 hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <GoogleMark />
              {loading ? "Checking code…" : "Continue with Google"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("in");
                setError(null);
                clearGateError();
              }}
              className="text-xs font-semibold text-dim hover:text-text"
            >
              Already have an account? Sign in
            </button>
          </form>
        )}

        {shownError && (
          <p className="text-[11px] text-danger mt-4">{shownError}</p>
        )}
      </div>
    </div>
  );
}
