import { SelectHTMLAttributes } from "react";
import * as reactselect from "react-select";

export interface selectField{
    value: string,
    label: string
}

export function Select(fields : selectField[]){
    return(
        <Select
      defaultValue={fields[0]}
      options={groupedOptions}
      formatGroupLabel={formatGroupLabel}
    />
    )
}