import React from "react";
import Select, { Props as SelectProps, StylesConfig } from "react-select";
import styled from "styled-components";

// Interface for custom styles
interface CustomStyles {
  minWidth?: string;
  height?: string; // Height is optional and can be set to auto
  color: string;
  backgroundColor: string;
  border?: boolean;
  borderRadius?: string;
  shadow?: boolean;
  fontSize?: string;
  fontWeight?: string | number;
  iconSize?: string; // Icon size for dropdown indicator
  iconMargin?: string; // Margin between the icon and the text
  menuMaxHeight?: string; // Max height for the dropdown menu to enable scrolling
}

// Interface for select options
interface OptionType {
  value: string;
  label: string;
}

// Props for the StyledSelect component
interface SelectOptionProps {
  options: OptionType[];
  placeholder: string;
  styles: CustomStyles;
  onChangeHandler: (selectedOption: OptionType | null) => void;
}

// Create custom styles function for react-select
const customStyles = (
  styles: CustomStyles
): StylesConfig<OptionType, false> => ({
  control: (base) => ({
    ...base,
    minWidth: styles.minWidth || "90px", // Default min width
    width: "auto", // Set width to auto
    minHeight: styles.height || "auto", // Set min-height to auto or specified value
    height: styles.height || "auto", // Set height to auto or specified value
    backgroundColor: styles.backgroundColor,
    borderRadius: styles.borderRadius || "16px",
    border: styles.border ? "1px solid #ccc" : "none",
    boxShadow: styles.shadow ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
    fontSize: styles.fontSize || "12px",
    fontWeight: styles.fontWeight || 400,
    whiteSpace: "nowrap",
  }),
  option: (base) => ({
    ...base,
    fontSize: styles.fontSize || "12px",
    fontWeight: styles.fontWeight || 400,
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: styles.fontSize || "12px",
    fontWeight: styles.fontWeight || 400,
    whiteSpace: "nowrap",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 2px",
  }),
  input: (base) => ({
    ...base,
    margin: "0",
    padding: "0",
    width: "auto", // Allows the width to adjust to the content
    display: "none", // Hide the input cursor
  }),
  indicatorsContainer: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    paddingRight: "0px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0",
    marginLeft: styles.iconMargin || "0px", // Adjust the space between the icon and the text
    svg: {
      width: styles.iconSize || "12px", // Set the width of the icon
      height: styles.iconSize || "12px", // Set the height of the icon
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: (base) => ({
    ...base,
    maxHeight: styles.menuMaxHeight || "200px", // Set max height for the menu
    overflowY: "auto", // Enable vertical scrolling if content exceeds max height
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "200px", // Set max height for the menu list
  }),
});

// Styled Select component using styled-components
const SelectStyled = styled(Select)<SelectProps<OptionType, false>>``;

const StyledSelect: React.FC<SelectOptionProps> = ({
  options,
  placeholder,
  styles,
  onChangeHandler,
}) => {
  return (
    <SelectStyled
      className="react-select-container"
      options={options}
      placeholder={placeholder}
      classNamePrefix="react-select"
      styles={customStyles(styles)}
      onChange={onChangeHandler}
      isSearchable={false}
    />
  );
};

export default StyledSelect;
