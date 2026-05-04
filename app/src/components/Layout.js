import Header from "./Header";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

export default function Layout(props) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <section className="bg-white shadow-sm px-6 py-6 border-b border-border">
        <Header title="Sports Performance Tracker" />
      </section>
      <div className="flex flex-1 overflow-hidden">
        <Navigation className="w-48 border-r border-border bg-sidebar" />
        <section className="flex-1 overflow-auto p-3">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
