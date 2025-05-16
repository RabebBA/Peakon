import Sidebar from "@/components/items/sidebar";
import { ProjectList } from "@/components/project/projects-list";

export default function Projects() {
  return (
    <div className=" gap-6 bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] ">
      <Sidebar>
        <ProjectList />
      </Sidebar>
    </div>
  );
}
