

import React, { JSX } from "react";
import ReactSelect, { components, OptionProps } from "react-select";
import { BsCoin } from "react-icons/bs";
import { SiSolana } from "react-icons/si";


type OptionType = {
  value: string;
  label: JSX.Element;
};
const options: OptionType[] = [
  {
    value: "SOL",
    label: (
      <>
        <SiSolana className="inline mr-1 text-[#14f195] text-xl" /> SOL
      </>
    ),
  },
  {
    value: "USDC",
    label: (
      <>
        <BsCoin className="inline mr-1 text-[#9954ff] text-xl" /> USDC
      </>
    ),
  },
];

type TokenSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

// const Option = (props: any) => (
//   <components.Option {...props}>{props.data.label}</components.Option>
// );
const Option = (props: OptionProps<OptionType, false>) => (
  <components.Option {...props}>{props.data.label}</components.Option>
);

export default function TokenSelect({ value, onChange }: TokenSelectProps) {
  return (
    <ReactSelect
      options={options}
      value={options.find((o) => o.value === value)}
      onChange={(selected) => onChange(selected ? selected.value : "")}
      components={{ Option }}
      isSearchable={false}
    />
  );
}
