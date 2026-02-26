import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AutoLogout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // get current path
  const [showWarning, setShowWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(60);

  useEffect(() => {
    // Don't activate auto-logout on login or forgot password pages
    if (location.pathname === "/" ) return;

    let inactivityTimer;
    let countdownTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      clearInterval(countdownTimer);
      setShowWarning(false);
      setWarningCountdown(60);

      inactivityTimer = setTimeout(() => {
        setShowWarning(true);
        countdownTimer = setInterval(() => {
          setWarningCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              navigate("/"); // auto logout
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 30 * 60 * 1000); // 5 minutes inactivity
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(inactivityTimer);
      clearInterval(countdownTimer);
    };
  }, [navigate, location.pathname]);

  const stayLoggedIn = () => {
    setShowWarning(false);
    setWarningCountdown(60);
  };

  return { showWarning, warningCountdown, stayLoggedIn };
};

export default AutoLogout;
