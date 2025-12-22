"use client";

import * as React from "react";
import { Checkbox } from "./checkbox";

interface FormCheckboxProps extends React.ComponentPropsWithoutRef<typeof Checkbox> {
  name: string;
  defaultChecked?: boolean;
}

/**
 * A form-compatible checkbox that works with server actions and FormData.
 * Wraps the shadcn/ui Checkbox component with a hidden input for form submission.
 */
export function FormCheckbox({ name, defaultChecked, ...props }: FormCheckboxProps) {
  const [checked, setChecked] = React.useState(defaultChecked ?? false);

  return (
    <>
      <Checkbox
        {...props}
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value === true);
        }}
      />
      <input
        type="hidden"
        name={name}
        value={checked ? "on" : "off"}
      />
    </>
  );
}

