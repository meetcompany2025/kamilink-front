import { toast } from "@/components/ui/use-toast"

export function showToast(title: string, description?: string, variant: "default" | "destructive" = "default") {
  toast({ title, description, variant })
}