import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import { SidebarInput } from "@/components/ui/sidebar";

export function SearchForm({ ...props }) {
  return (
    <form {...props}>
      <div className="relative shadow-sm text-neutral-700">
        <Label htmlFor="search" className="sr-only text-neutral-700">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Type to search..."
          className="h-8 pl-7"
        />
        <Search className="text-neutral-700 dark:text-neutral-400 pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </div>
    </form>
  );
}
