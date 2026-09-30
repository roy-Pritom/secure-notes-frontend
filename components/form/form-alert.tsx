import { CircleAlertIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function FormAlert({ messages }: { messages: string[] | null }) {
  if (!messages?.length) return null
  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertDescription>
        {messages.length === 1 ? (
          messages[0]
        ) : (
          <ul className="list-disc pl-4">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}
