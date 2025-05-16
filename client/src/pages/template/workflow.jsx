import Sidebar from "@/components/items/sidebar";
import WorkflowBuilder from "@/components/workflow/workflow-builder";

export default function Workflow() {
  return (
    <div className=" gap-6 bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] ">
      <Sidebar>
        <WorkflowBuilder />
      </Sidebar>
    </div>
  );
}
