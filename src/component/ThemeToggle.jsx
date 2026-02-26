import { Sun } from "lucide-react";
import { useTheme } from "../component/ThemeContext"; 
import { TbMoonStars } from "react-icons/tb";

const ThemeToggle = () => {
  const { isDark, setIsDark } = useTheme();

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="p-2 rounded-full bg-overall_bg-light dark:bg-overall_bg-dark transition"
    >
      {isDark ? (
        <TbMoonStars className="h-5 w-5 text-layout_text-dark" />
      ) : (
        <Sun className="h-5 w-5 text-layout_text-light" />
      )}
    </button>
  );
};

export default ThemeToggle;
