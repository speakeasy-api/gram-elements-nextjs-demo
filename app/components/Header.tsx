export function Header() {
  return (
    <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🍌</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">nanoBanana Stand</h1>
              <p className="text-sm text-yellow-900 italic">There's always money in the nanobanana stand</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-yellow-900">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
