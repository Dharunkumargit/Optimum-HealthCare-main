import React, { useState, useRef, useEffect } from "react";
import { BiFilterAlt } from "react-icons/bi";

const Filter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Filter");
  const dropdownRef = useRef(null);

  // Calculate date ranges
  const today = new Date();
  const getDateRange = (type) => {
    const start = new Date();
    const end = new Date();

    switch (type) {
      case "thisMonth":
        start.setDate(1);
        end.setMonth(start.getMonth() + 1);
        end.setDate(0); // last day of this month
        break;
      case "lastMonth":
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        end.setMonth(end.getMonth());
        end.setDate(0); // last day of last month
        break;
      case "last3Months":
        start.setMonth(start.getMonth() - 3);
        start.setDate(1);
        end.setMonth(end.getMonth());
        end.setDate(0);
        break;
      case "last6Months":
        start.setMonth(start.getMonth() - 6);
        start.setDate(1);
        end.setMonth(end.getMonth());
        end.setDate(0);
        break;
      case "last12Months":
        start.setMonth(start.getMonth() - 12);
        start.setDate(1);
        end.setMonth(end.getMonth());
        end.setDate(0);
        break;
      default:
        return { fromdate: "", todate: "" };
    }

    // Format as yyyy-mm-dd
    const formatDate = (d) => d.toISOString().split("T")[0];

    return { fromdate: formatDate(start), todate: formatDate(end) };
  };

  const options = [
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last 3 Months", value: "last3Months" },
    { label: "Last 6 Months", value: "last6Months" },
    { label: "Last 12 Months", value: "last12Months" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    const range = getDateRange(option.value);
    onFilterChange(range); // Send {fromdate, todate} to parent
  };

  return (
    <div ref={dropdownRef} className="inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer dark:bg-layout-dark bg-layout-light dark:text-white flex items-center px-4 py-2 gap-1.5 rounded-md"
      >
        <BiFilterAlt />
        {selectedOption}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg dark:bg-layout-dark bg-layout-light dark:text-white">
          <div className="py-1 text-sm font-semibold">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left px-4 py-2 hover:bg-select_layout-dark"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
