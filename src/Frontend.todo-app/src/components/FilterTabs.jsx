import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FilterTabs({ activeFilter, onFilterChange, counts }) {
   return (
      <Tabs value={activeFilter} onValueChange={(v) => onFilterChange(v)}>
         <TabsList className="inline-flex rounded-full bg-muted px-1 py-1 text-[16px] font-medium">
            <TabsTrigger
               data-testid="tab-all"
               value="all"
               className="px-4 py-1.5 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition text-[18px]"
            >
               All ({counts.all})
            </TabsTrigger>
            <TabsTrigger
               data-testid="tab-active"
               value="active"
               className="px-4 py-1.5 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition text-[18px]"
            >
               Active ({counts.active})
            </TabsTrigger>
            <TabsTrigger
               data-testid="tab-completed"
               value="completed"
               className="px-4 py-1.5 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition text-[18px]"
            >
               Completed ({counts.completed})
            </TabsTrigger>
         </TabsList>
      </Tabs>
   );
}
