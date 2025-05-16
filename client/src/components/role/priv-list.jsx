import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react"; // icônes pour Global et Project
import { privateFetch } from "../../../utils/fetch";
import { Badge } from "../ui/badge";

export function PrivilegeList() {
  const [privileges, setPrivileges] = useState([]);
  const [routesById, setRoutesById] = useState({});

  useEffect(() => {
    privateFetch
      .get("/privileges")
      .then((res) => {
        const privilegesArray = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setPrivileges(privilegesArray);

        const routeIds = [
          ...new Set(
            privilegesArray
              .map((p) =>
                typeof p.routeId === "string" ? p.routeId : p.routeId?._id
              )
              .filter(Boolean)
          ),
        ];

        Promise.all(
          routeIds.map((id) =>
            privateFetch.get(`/routes/${id}`).then((res) => [id, res.data])
          )
        )
          .then((results) => {
            const routesMap = {};
            results.forEach(([id, route]) => {
              routesMap[id] = route;
            });
            setRoutesById(routesMap);
          })
          .catch((err) => {
            console.error("Error fetching routes:", err);
          });
      })
      .catch((err) => console.error("Error fetching privileges:", err));
  }, []);

  const groupedPrivileges = Array.isArray(privileges)
    ? privileges.reduce(
        (acc, p) => {
          acc[p.type].push(p);
          return acc;
        },
        { Global: [], Project: [] }
      )
    : { Global: [], Project: [] };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col gap-8 max-w-3xl mx-auto">
      <PrivilegeGroup
        title="Global Privileges"
        bgColor="bg-blue-50"
        darkBgColor="bg-blue-900/40"
        borderColor="border-blue-300"
        darkBorderColor="border-blue-600"
        darkText="text-blue-200"
        privileges={groupedPrivileges.Global}
        routesById={routesById}
      />
      <PrivilegeGroup
        title="Project Privileges"
        bgColor="bg-purple-50"
        darkBgColor="bg-blue-900/40"
        borderColor="border-purple-300"
        darkBorderColor="border-purple-600"
        darkText="text-purple-200"
        privileges={groupedPrivileges.Project}
        routesById={routesById}
      />
    </div>
  );
}

function PrivilegeGroup({
  title,
  bgColor,
  darkBgColor,
  borderColor,
  darkBorderColor,
  darkText,
  privileges,
  routesById,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const colorMatch = bgColor.match(/bg-(\w+)-50/);
  const color = colorMatch?.[1] || "gray"; // fallback

  return (
    <div
      className={`${bgColor} dark:${darkBgColor} border ${borderColor} dark:${darkBorderColor} rounded-lg p-5 shadow-sm`}
    >
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <h3
            className={`font-semibold text-xl text-gray-800 dark:${darkText}`}
          >
            {title}
          </h3>
          <Badge className={`bg-${color}-200 text-${color}-800 ml-2`}>
            {privileges.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${title}`}
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </Button>
      </div>
      {isOpen && (
        <div className="mt-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
          {privileges.length === 0 && (
            <p className="text-gray-500 italic text-sm">
              No privileges available.
            </p>
          )}
          {privileges.map((p) => {
            const routeId =
              typeof p.routeId === "string" ? p.routeId : p.routeId?._id;
            const route = routesById[routeId];
            return (
              <div
                key={p._id}
                className="flex flex-col gap-1 p-3 rounded-md bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="font-medium text-base text-gray-900">
                  {route?.title || "Untitled"}
                </div>
                <div className="text-gray-600 text-sm leading-snug">
                  {route?.description || "No description"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
