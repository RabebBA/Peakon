import { useEffect, useState } from "react";
import { privateFetch } from "../../../utils/fetch";

export function useAccessData(type) {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availablePrivileges, setAvailablePrivileges] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    async function fetchAccessData() {
      try {
        const [rolesRes, privsRes, routesRes] = await Promise.all([
          privateFetch.get(`/role/${type}`),
          privateFetch.get(`/privileges/${type}`),
          privateFetch.get("/routes"),
        ]);

        const routesArray = Array.isArray(routesRes.data)
          ? routesRes.data
          : routesRes.data?.data || routesRes.data?.content || [];

        const privsArray = Array.isArray(privsRes.data)
          ? privsRes.data
          : privsRes.data?.data || privsRes.data?.content || [];

        const rolesArray = Array.isArray(rolesRes.data)
          ? rolesRes.data
          : rolesRes.data?.data || rolesRes.data?.content || [];

        const privileges = privsArray.map((priv) => {
          const route = routesArray.find((r) => r._id === priv.routeId);
          return {
            _id: priv._id,
            title: route?.title || "No title",
            method: route?.endPoint?.split(" ")[0] || "GET",
            routeId: route?.endPoint?.split(" ")[1] || route?.endPoint || "/",
          };
        });

        const roles = rolesArray.map((role) => ({
          _id: role._id,
          title: role.title,
          privId: role.privId,
          description: `Role with ${role.privId?.length ?? 0} privileges`,
        }));

        setRoutes(routesArray);
        setAvailablePrivileges(privileges);
        setAvailableRoles(roles);
      } catch (err) {
        console.error("Failed to fetch access data:", err);
      }
    }

    fetchAccessData();
  }, [type]);

  return { availableRoles, availablePrivileges, routes };
}
