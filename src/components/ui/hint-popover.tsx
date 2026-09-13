import { HelpCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function HintPopover({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover={true}
        render={
          <Button
            variant={"link"}
            size={"icon-sm"}
            className="size-4 translate-y-1/8"
          >
            <HelpCircleIcon />
          </Button>
        }
      />
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
}
