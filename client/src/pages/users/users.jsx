import Sidebar from "@/components/items/sidebar";
import UsersPage from "@/components/users/users-list-front";

export default function Users() {
  return (
    <div className=" gap-6 bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] ">
      <Sidebar>
        <UsersPage />
      </Sidebar>
    </div>
  );
}
