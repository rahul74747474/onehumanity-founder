export function InfoTooltip({ text }) {
  return (
    <span className="relative inline-flex items-center ml-[10px] cursor-pointer group">
      <span className="w-4 h-4 rounded-full bg-[rgb(240,239,239)] text-black border border-[rgba(0,0,0,0.368)] text-[11px] font-bold flex items-center justify-center">i</span>
      <span className="fixed bg-[rgba(72,76,86,0.8)] text-white py-2 px-[10px] rounded-[6px] text-xs max-w-[220px] leading-[1.4] opacity-0 pointer-events-none transition-opacity duration-100 ease-out z-[99999] group-hover:opacity-100">{text}</span>
    </span>
  );
}
