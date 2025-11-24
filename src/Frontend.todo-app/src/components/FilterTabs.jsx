import { useState } from 'react';

export default function FilterTabs({ activeFilter = "all", onFilterChange = () => { }, counts = { all: 0, active: 0, completed: 0 } }) {
   const [hoveredTab, setHoveredTab] = useState(null);

   const tabs = [
      { id: 'all', label: 'All', count: counts.all, color: 'from-blue-500 to-cyan-500', darkColor: 'dark:from-blue-400 dark:to-cyan-400' },
      { id: 'active', label: 'Active', count: counts.active, color: 'from-amber-500 to-orange-500', darkColor: 'dark:from-amber-400 dark:to-orange-400' },
      { id: 'completed', label: 'Completed', count: counts.completed, color: 'from-emerald-500 to-teal-500', darkColor: 'dark:from-emerald-400 dark:to-teal-400' }
   ];

   return (
      <div className="flex items-center gap-3 p-1">
         {tabs.map((tab) => {
            const isActive = activeFilter === tab.id;

            return (
               <button
                  key={tab.id}
                  data-testid={`tab-${tab.id}`}
                  onClick={() => onFilterChange(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`relative px-6 py-2 rounded-lg font-semibold text-base transition-all duration-300 overflow-hidden group ${isActive
                     ? 'text-white shadow-lg scale-105'
                     : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                     }`}
               >
                  {/* Animated gradient background for active state */}
                  {isActive && (
                     <>
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} ${tab.darkColor} opacity-100 transition-all duration-300`} />
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} ${tab.darkColor} opacity-0 group-hover:opacity-20 blur-xl`} />
                     </>
                  )}

                  {/* Hover gradient overlay for inactive tabs */}
                  {!isActive && (
                     <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} ${tab.darkColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  )}

                  {/* Content */}
                  <div className="relative flex items-center gap-2.5 z-10">
                     <span className="tracking-wide">{tab.label}</span>
                     <span className={`inline-flex items-center justify-center min-w-6 h-6 rounded-full text-sm font-bold backdrop-blur-sm transition-all duration-300 ${isActive
                        ? `bg-white/20 text-white`
                        : `bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 group-hover:bg-slate-300/80 dark:group-hover:bg-slate-600/80`
                        }`}>
                        {tab.count}
                     </span>
                  </div>

                  {/* Bottom accent line */}
                  {isActive && (
                     <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.color} ${tab.darkColor} transform scale-x-100 transition-transform duration-300`} />
                  )}
               </button>
            );
         })}
      </div>
   );
}