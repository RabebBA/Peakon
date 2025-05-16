import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function MultiSelect({
  selected = [],
  onChange,
  label = "Sélectionner",
  itemLabelKey = "label",
  itemValueKey = "value",
  items = [],
  showSummary = true,
}) {
  const toggleItem = (itemId) => {
    const updated = selected.includes(itemId)
      ? selected.filter((id) => id !== itemId)
      : [...selected, itemId];
    onChange(updated);
  };

  const selectedItems = items.filter((item) =>
    selected.includes(item[itemValueKey])
  );

  const summaryDisplay = () => {
    if (selectedItems.length === 0) return label;
    if (selectedItems.length <= 2)
      return selectedItems.map((item) => item[itemLabelKey]).join(", ");
    return (
      selectedItems
        .slice(0, 2)
        .map((item) => item[itemLabelKey])
        .join(", ") + ` +${selectedItems.length - 2}`
    );
  };

  return (
    <div className="w-full space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left truncate"
            title={selectedItems.map((item) => item[itemLabelKey]).join(", ")}
          >
            {summaryDisplay()}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-3 space-y-2 max-h-60 overflow-y-auto border shadow-lg rounded-md bg-white">
          {items.map((item) => {
            const isChecked = selected.includes(item[itemValueKey]);
            return (
              <div
                key={item[itemValueKey]}
                className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-gray-100 transition cursor-pointer"
                onClick={() => toggleItem(item[itemValueKey])}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Checkbox checked={isChecked} />
                  <span>{item[itemLabelKey]}</span>
                </div>
                {isChecked}
              </div>
            );
          })}
        </PopoverContent>
      </Popover>

      {showSummary && selectedItems.length > 0 && (
        <div className="p-3 border border-gray-200 bg-gray-50 shadow-sm rounded-md space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            Éléments sélectionnés :
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span
                key={item[itemValueKey]}
                className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                {item[itemLabelKey]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
