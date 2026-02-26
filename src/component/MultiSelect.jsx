import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export default function MultiSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);

  // Normalize option to { value, label }
  const normalizeOption = (option) =>
    typeof option === "string" ? { value: option, label: option } : option;

  const toggleSelect = (option) => {
    const { value: val } = normalizeOption(option);
    if (value.includes(val)) {
      onChange(value.filter((item) => item !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeOption = (val) => {
    onChange(value.filter((item) => item !== val));
  };

  // Filter options → only show unselected in dropdown
  const availableOptions = options.filter((o) => {
    const { value: val } = normalizeOption(o);
    return !value.includes(val);
  });

  return (
    <div className="relative w-64 ">
      {/* Control */}
      <div
        className="border border-gray-600 dark:border-gray-400 rounded-md px-2 py-2.5 flex flex-wrap gap-1 items-center bg-white dark:bg-transparent cursor-pointer min-h-[38px]"
        onClick={() => setOpen(!open)}
      >
        {value.length > 0 ? (
          value.map((val) => {
            const opt = normalizeOption(
              options.find((o) =>
                typeof o === "string" ? o === val : o.value === val
              )
            );
            return (
              <span
                key={val}
                className="flex items-center bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md px-2 py-0.5 text-sm"
              >
                {opt?.label || val}
                <X
                  size={14}
                  className="ml-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(val);
                  }}
                />
              </span>
            );
          })
        ) : (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {placeholder}
          </span>
        )}
        <ChevronDown
          size={18}
          className={`ml-auto transition-transform ${
            open ? "rotate-180" : ""
          } text-gray-600 dark:text-gray-300`}
        />
      </div>

      {/* Dropdown menu */}
      {open && availableOptions.length > 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto z-50">
          {availableOptions.map((option,idx) => {
            const { value: val, label } = normalizeOption(option);
            return (
              <div
                key={`${val}-${idx}`}
                onClick={() => toggleSelect(option)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
