import { toast } from "sonner";

export const showSuccess = (msg: string) => toast.success(msg, { duration: 3000 });
export const showError = (msg: string) => toast.error(msg, { duration: 4000 });
