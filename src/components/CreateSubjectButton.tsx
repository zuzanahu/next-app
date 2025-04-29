import { Button, Popover, PopoverDropdown, PopoverTarget } from "@mantine/core";
import { CreateSubjectForm } from "./CreateSubjectForm";

export function CreateSubjectButton() {
  return (
    <Popover width={300} trapFocus position="bottom-end" withArrow shadow="md">
      <PopoverTarget>
        <Button>Přidat předmět</Button>
      </PopoverTarget>
      <PopoverDropdown>
        <CreateSubjectForm />
      </PopoverDropdown>
    </Popover>
  );
}
