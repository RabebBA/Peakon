import Sidebar from "@/components/items/sidebar";
import ProjectPage from "@/components/project/project-page";

export default function Project() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] text-white">
      <Sidebar>
        <ProjectPage />
      </Sidebar>
    </div>
  );
}
