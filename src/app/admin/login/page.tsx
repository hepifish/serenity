export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="status">
      <form className="form status-inner" action="/api/admin/login" method="post" style={{ width: "min(100%, 22rem)" }}>
        <p className="logo" style={{ fontSize: "2rem" }}>Serenity<span style={{ color: "var(--gold)" }}>.</span></p>
        <div className="field" style={{ width: "100%" }}>
          <label htmlFor="pw">Password</label>
          <input id="pw" name="password" type="password" autoComplete="current-password" required autoFocus />
        </div>
        {error ? <p className="error-text" role="alert">{error === "limit" ? "Too many attempts. Try again in 10 minutes." : "That password didn't work."}</p> : null}
        <button className="btn block">Enter</button>
      </form>
    </main>
  );
}
