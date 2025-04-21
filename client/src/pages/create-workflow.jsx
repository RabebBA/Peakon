import WorkflowEditor from "@/components/workflow-builder";
import Sidebar from "@/components/sidebar";

export default function CreateWorkflow() {
  return (
    <div className=" gap-6 bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] ">
      <Sidebar>
        <WorkflowEditor />
      </Sidebar>
    </div>
  );
}
