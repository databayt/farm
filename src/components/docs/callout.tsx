import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Ported from hogwarts: mirrors the ui.shadcn.com/docs <Callout>, one neutral
// surface for every callout; an icon renders only when passed in MDX.
interface CalloutProps extends Omit<ComponentProps<typeof Alert>, "title" | "variant"> {
  title?: string
  icon?: ReactNode
  variant?: "default" | "info" | "warning"
}

export function Callout({ title, icon, variant = "default", className, children, ...props }: CalloutProps) {
  return (
    <Alert
      data-variant={variant}
      className={cn("not-prose bg-muted/50 mt-6 w-auto rounded-xl md:-mx-1 **:[code]:border", className)}
      {...props}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-card-foreground/80">{children}</AlertDescription>
    </Alert>
  )
}
