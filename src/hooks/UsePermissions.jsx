import { useMemo } from "react";

const usePermission = () => {
  // ✅ Safely parse user data from localStorage
  const user = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("employee");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, []);

  // ✅ Permission checker
  const hasPermission = (feature, permission) => {
    if (!user?.role?.accessLevels) return false;

    const featureAccess = user.role.accessLevels.find(
      (item) => item.feature.toLowerCase() === feature.toLowerCase()
    );

    if (!featureAccess) return false;

    return (
      featureAccess.permissions.includes("All") ||
      featureAccess.permissions.includes(permission)
    );
  };

  return { hasPermission, user };
};

export default usePermission;
