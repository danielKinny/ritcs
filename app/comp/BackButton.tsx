export function BackButton({ dest, href }: { dest: string; href: string }) {
  return (
    <div className="inline-block">
      <a
        href={href}
        className="text-indigo-600 hover:bg-blue-500 hover:text-white transition-colors mb-2 inline-block p-2 border border-blue-500 mt-2 rounded-lg bg-white shadow-sm"
      >
        Back to {dest}
      </a>
    </div>
  );
}

export default BackButton;

//backbutton comp because recoding it every time is tedious

//hehehehhehe