import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { unsplash } from "@/lib/unsplash";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartNoAxesGantt, HelpCircle } from "lucide-react";
import { FormPopover } from "@/components/form/popover-form";
import { Hint } from "@/components/items/hint";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const result = await unsplash.search.getPhotos({
          query: "nature",
          page: randomPage,
          perPage: 10,
        });

        if (result?.response?.results) {
          const shuffled = result.response.results.sort(
            () => 0.5 - Math.random()
          );
          const selected = shuffled.slice(0, 8);
          const projects = selected.map((img, i) => ({
            id: img.id,
            title: `Project ${i + 1}`,
            imageThumbUrl: img.urls.thumb,
          }));
          setProjects(projects);
        }
      } catch (err) {
        console.error("Unsplash error", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCopy = (project) => {
    console.log("Project copied:", project);
    // Duplication logic here
  };

  const handleArchive = (project) => {
    console.log("Project archived:", project);
    // Archiving logic here
  };

  const handleDelete = (project) => {
    console.log("Project deleted:", project);
    // Deletion logic here
  };

  return (
    <div className="space-y-7 pt-7">
      <div className="flex items-center font-semibold text-lg text-neutral-800 dark:text-neutral-200">
        <ChartNoAxesGantt className="h-6 w-6 mr-2" />
        Projects
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="aspect-video h-full w-full p-2" />
            ))
          : projects.map((project) => (
              <ContextMenu key={project.id}>
                <ContextMenuTrigger asChild>
                  <Link
                    to={`/project/${project.id}`}
                    className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                    style={{ backgroundImage: `url(${project.imageThumbUrl})` }}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 hover:shadow-md transition" />
                    <p className="relative font-semibold text-xl text-white pt-1">
                      {project.title}
                    </p>
                  </Link>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-48 text-neutral-800 dark:text-neutral-200">
                  <ContextMenuItem onClick={() => handleCopy(project)}>
                    Copy
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleArchive(project)}>
                    Archive
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleDelete(project)}
                    className="text-red-500 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-neutral-200"
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
        <FormPopover sideOffset={10} side="right">
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-700 rounded-md flex flex-col items-center justify-center hover:shadow-md transition"
          >
            <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Create new project
            </p>
            <Hint
              sideOffset={40}
              description="Add a new project to your workspace."
            >
              <div className="absolute bottom-2 right-2 text-gray-400">
                <HelpCircle className="h-[14px] w-[14px]" />
              </div>
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};
