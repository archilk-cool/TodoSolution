import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}) {
  return (
    <Tabs value={activeFilter} onValueChange={(v) => onFilterChange(v)}>
      <TabsList className="w-full justify-start">
        <TabsTrigger data-testid="tab-all" value="all" className="flex-1">
          All ({counts.all})
        </TabsTrigger>
        <TabsTrigger data-testid="tab-active" value="active" className="flex-1">
          Active ({counts.active})
        </TabsTrigger>
        <TabsTrigger data-testid="tab-completed" value="completed" className="flex-1">
          Completed ({counts.completed})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
