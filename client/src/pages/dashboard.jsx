import Sidebar from "@/components/sidebar";
import { BoardList } from "@/components/dashboards";

export default function Dashboard() {
  return (
    <div className=" gap-6 bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] ">
      <Sidebar>
        <BoardList />
      </Sidebar>
    </div>
  );
}
