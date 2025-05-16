import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone number" },
  { value: "url", label: "URL" },
  { value: "range", label: "Range slider" },
  { value: "checkbox", label: "Checkbox (multiple options)" },
  { value: "radio", label: "Radio (single choice)" },
  { value: "file", label: "File (ppt, word, image...)" },
];

export function FormBuilder({ fields, onChange }) {
  const addField = () => {
    onChange([
      ...fields,
      { label: "", type: "text", isRequired: false, options: [] },
    ]);
  };

  const updateField = (index, updates) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange(newFields);
  };

  const updateOption = (index, optIndex, value) => {
    const newFields = [...fields];
    newFields[index].options[optIndex] = value;
    onChange(newFields);
  };

  const addOption = (index) => {
    const newFields = [...fields];
    newFields[index].options.push("");
    onChange(newFields);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    onChange(newFields);
  };

  return (
    <div className="space-y-8 mx-auto p-4 max-w-2xl w-5/6">
      {fields.map((field, idx) => (
        <div
          key={idx}
          className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-5"
        >
          <button
            onClick={() => removeField(idx)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            aria-label="Delete this field"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Field label</Label>
            <Input
              placeholder="Field label"
              value={field.label}
              onChange={(e) => updateField(idx, { label: e.target.value })}
              className="text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Field type</Label>
            <Select
              value={field.type}
              onValueChange={(value) => updateField(idx, { type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Field type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.isRequired}
              onCheckedChange={(value) =>
                updateField(idx, { isRequired: !!value })
              }
              className="h-4 w-4 text-primary"
            />
            <Label className="text-sm font-medium">Required field</Label>
          </div>

          {["checkbox", "radio"].includes(field.type) && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Field options</Label>
              {field.options.map((opt, optIdx) => (
                <Input
                  key={optIdx}
                  value={opt}
                  placeholder={`Option ${optIdx + 1}`}
                  onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                  className="text-base"
                />
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => addOption(idx)}
                className="w-full flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add an option</span>
              </Button>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-center">
        <Button
          onClick={addField}
          type="button"
          variant="outline"
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add a field</span>
        </Button>
      </div>
    </div>
  );
}
