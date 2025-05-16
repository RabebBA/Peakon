import Sidebar from "@/components/items/sidebar";
import CreateProjectForm from "@/components/project/project-form";
import { useEffect, useState } from "react";
import { privateFetch } from "../../../utils/fetch";
import { toast } from "sonner";

export default function CreateProjectPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await privateFetch.get("/template");
        setTemplates(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading templates...</p>;

  return (
    <Sidebar>
      <CreateProjectForm
        templates={templates}
        onCreateRole={async (newRole) => {
          const res = await privateFetch.post("/roles", newRole);
          return res.data.data;
        }}
        onSubmit={async (projectData) => {
          try {
            const res = await privateFetch.post("/project", projectData);
            toast.success("Project created successfully");
          } catch (err) {
            console.error("Failed to create project:", err);
            toast.error;
          }
        }}
      />
    </Sidebar>
  );
}
