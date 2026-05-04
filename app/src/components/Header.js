export default function Header(props) {
  const todaysDate = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg shadow-cyan-200">
          🏆
        </span>

        <div>
          <h1 className="m-0 font-['MongoDB_Value_Serif'] text-3xl font-medium leading-tight text-slate-900 md:text-4xl">
            {props.title}
          </h1>
          <p className="m-0 mt-1 text-sm font-medium text-slate-500">
            Track sessions, milestones, and progression in one place.
          </p>
        </div>
      </div>

      <div className="inline-flex w-fit items-center rounded-full border border-cyan-100 bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-800">
        Updated {todaysDate}
      </div>
    </div>
  );
}
