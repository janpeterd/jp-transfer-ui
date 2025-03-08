import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FormControl } from "./ui/form";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ValueLabel = {
  value: string;
  label: string;
};

interface ObjectSelectProps {
  objectName: string;
  objects: ValueLabel[];
  value: string | undefined; // Value could be undefined if unselected
  onChange: (value: string) => void;
}

function ObjectSelect({ objectName, objects: objects, value, onChange }: ObjectSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? objects.find((object) => object.value === value)?.label
              : `Select ${objectName}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${objectName}...`} />
          <CommandList>
            <CommandEmpty>No {objectName} found.</CommandEmpty>
            <CommandGroup>
              {objects.map((object, index) => (
                <>
                  <CommandItem
                    value={object.label}
                    key={object.value}
                    onSelect={() => onChange(object.value)} // Call the onChange prop when selected
                  >
                    {object.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        object.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ObjectSelect;
