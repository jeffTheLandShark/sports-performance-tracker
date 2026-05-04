export default function Header(props) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl">🏆</span>
      <h1 className="text-2xl font-semibold text-foreground">{props.title}</h1>
    </div>
  );
}
