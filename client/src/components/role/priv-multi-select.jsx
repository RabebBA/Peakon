import { useState } from "react";
import {
  Command,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";

export function PriviMultiSelect({
  value = [],
  onChange,
  options = [],
  placeholder = "Select privileges...",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const togglePrivilege = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const filteredOptions = options.filter((option) => {
    const text = option.label ?? option.description ?? option.title ?? ""; // fallback si tout est undefined
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const removePrivilege = (id, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== id));
  };

  const getPrivilege = (id) => options.find((p) => p._id === id);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          role="combobox"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="w-full cursor-pointer border border-input bg-background px-3 py-2 text-sm shadow-sm rounded-md flex justify-between items-center gap-2"
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {value.map((id) => {
                const priv = getPrivilege(id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {priv?.label || id}
                    <X
                      className="h-3 w-3 cursor-pointer text-neutral-300 hover:text-neutral-800"
                      onClick={(e) => removePrivilege(id, e)}
                    />
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search privileges..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {filteredOptions.map((option) => {
              const isSelected = value.includes(option._id);

              return (
                <CommandItem
                  key={option._id}
                  onSelect={() => togglePrivilege(option._id)}
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-4 w-4 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {option.label ??
                      option.description ??
                      option.title ??
                      option._id}
                  </div>
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
