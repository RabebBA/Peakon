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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";

export function RoleMultiSelect({
  value,
  onChange,
  options,
  availablePrivileges,
  placeholder = "Select a role",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleRole = (roleId) => {
    if (value.includes(roleId)) {
      onChange(value.filter((v) => v !== roleId));
    } else {
      onChange([...value, roleId]);
    }
  };

  const getRole = (id) => options.find((r) => r._id === id);

  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(search.toLowerCase())
  );

  const removeRole = (roleId, event) => {
    event.stopPropagation();
    onChange(value.filter((v) => v !== roleId));
  };

  const getPrivilegesText = (privIds = []) =>
    privIds
      .map((id) => availablePrivileges.find((p) => p._id === id)?.title)
      .filter(Boolean);

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
              {value.map((roleId) => {
                const role = getRole(roleId);
                return (
                  <Badge
                    key={roleId}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {role?.title || roleId}
                    <X
                      className="h-3 w-3 cursor-pointer text-neutral-300 hover:text-neutral-800"
                      onClick={(e) => removeRole(roleId, e)}
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

      <PopoverContent className="w-[250px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for a role..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {filteredOptions.map((option) => {
              const isSelected = value.includes(option._id);
              const privilegeList = getPrivilegesText(option.privId);

              return (
                <HoverCard key={option._id} openDelay={100}>
                  <HoverCardTrigger asChild>
                    <CommandItem onSelect={() => toggleRole(option._id)}>
                      <div className="flex items-center gap-2">
                        <Check
                          className={`h-4 w-4 ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {option.title}
                      </div>
                    </CommandItem>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="right"
                    className="w-64 max-h-64 overflow-y-auto bg-white p-4 rounded-lg shadow-md border border-neutral-200"
                  >
                    <p className="font-semibold text-neutral-700 mb-2">
                      Privileges:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {privilegeList.length > 0 ? (
                        privilegeList.map((desc, idx) => (
                          <li key={idx} className="text-neutral-600">
                            {desc}
                          </li>
                        ))
                      ) : (
                        <li className="text-neutral-500">No privileges</li>
                      )}
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
