import FormsDemo from "@/components/users/user-form";
import Sidebar from "@/components/items/sidebar";

export default function CreateUser() {
  return (
    <div className=" gap-6 bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] ">
      <Sidebar>
        <FormsDemo />
      </Sidebar>
    </div>
  );
}
