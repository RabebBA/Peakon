import PrivilegesList from "@/components/privileges-list";
import Sidebar from "@/components/sidebar";

export default function Page() {
  return (
    <div className=" gap-6 bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] ">
      <Sidebar>
        <PrivilegesList />
      </Sidebar>
    </div>
  );
}
