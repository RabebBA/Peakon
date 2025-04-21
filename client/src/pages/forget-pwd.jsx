import { ForgotPasswordForm } from "@/components/forget-pwd-form";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
