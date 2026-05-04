import Header from "./Header";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

export default function Layout(props) {
  return (
    <div className="min-h-screen w-full px-3 py-3 md:px-6 md:py-6">
      <section className="page-shell rounded-2xl border border-sky-100 bg-white/90 px-5 py-5 shadow-[0_8px_40px_rgba(15,23,42,0.08)] backdrop-blur md:px-7 md:py-6">
        <Header title="Sports Performance Tracker" />
      </section>

      <div className="page-shell mt-4 flex flex-col gap-4 md:mt-5 md:flex-row md:items-start">
        <Navigation className="w-full rounded-2xl border border-slate-200/80 bg-white/85 shadow-[0_8px_35px_rgba(15,23,42,0.06)] md:sticky md:top-4 md:w-64" />

        <section className="min-h-[72vh] flex-1 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur md:p-6">
          <div className="page-shell">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
