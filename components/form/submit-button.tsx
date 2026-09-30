import type { ComponentProps } from "react"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SubmitButton({
  pending,
  children,
  disabled,
  ...props
}: ComponentProps<typeof Button> & { pending?: boolean }) {
  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending && <Loader2Icon className="animate-spin" />}
      {children}
    </Button>
  )
}
