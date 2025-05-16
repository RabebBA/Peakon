import { PrivilegeList } from "./priv-list";
import { RoleTable } from "./role-table";

export default function RoleDashboard() {
  return (
    <div className="p-2  min-h-screen text-neutral-800 dark:text-neutral-200">
      <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 py-6">
        Roles & Privileges
      </h1>
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 min-h-full">
        <div className="md:col-span-1">
          <PrivilegeList />
        </div>
        <div className="md:col-span-2">
          <RoleTable />
        </div>
      </div>
    </div>
  );
}
