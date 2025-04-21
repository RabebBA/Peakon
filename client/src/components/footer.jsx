import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t bg-slate-100">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo dark={true} />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <a href="/privacy-policy">
            <Button size="sm" variant="ghost">
              Privacy Policy
            </Button>
          </a>
          <a href="/terms-of-service">
            <Button size="sm" variant="ghost">
              Terms of service
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
