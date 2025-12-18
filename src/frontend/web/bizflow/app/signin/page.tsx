"use client";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
        {/* Header */}
        <div className="p-6 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
            <span className="text-emerald-400 text-xl font-bold">BF</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">BizFlow</h1>
          <p className="text-slate-300 text-sm">
            Digital operations for household businesses
          </p>
        </div>

        {/* Form */}
        <form className="px-6 pb-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              placeholder="you@business.vn"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors py-2 font-medium"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center text-sm text-slate-400">
          <span>New to BizFlow?</span>{" "}
          <a href="#" className="text-emerald-400 hover:underline">
            Create an account
          </a>
        </div>
      </div>

      <p className="absolute bottom-4 text-xs text-slate-500">
        © {new Date().getFullYear()} BizFlow
      </p>
    </div>
  );
}
