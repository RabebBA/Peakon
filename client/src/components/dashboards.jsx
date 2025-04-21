import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { unsplash } from "@/lib/unsplash";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRound, HelpCircle } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/hint";

export const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
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
          const selected = shuffled.slice(0, 8); // Prend 6 images aléatoires

          const boards = selected.map((img, i) => ({
            id: img.id,
            title: `Project ${i + 1}`,
            imageThumbUrl: img.urls.thumb,
          }));

          setBoards(boards);
        }
      } catch (err) {
        console.error("Erreur Unsplash", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="space-y-7 pt-7">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <UserRound className="h-6 w-6 mr-2" />
        Your projects
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5  gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="aspect-video h-full w-full p-2" />
            ))
          : boards.map((board) => (
              <Link
                key={board.id}
                to={`/board/${board.id}`}
                className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 hover:shadow-md transition" />
                <p className="relative font-semibold text-xl text-white pt-1">
                  {board.title}
                </p>
              </Link>
            ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <FormPopover sideOffset={10} side="right">
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-gray-100 border border-gray-300 rounded-md flex flex-col items-center justify-center hover:shadow-md transition"
          >
            <p className="text-xl font-medium text-gray-800">
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
