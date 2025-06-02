import Download from '@/app/download/page'
import { uuidSchema } from '@/schemas/uuid'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/download/$linkUuid')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const isUuid = uuidSchema.safeParse(params.linkUuid).success

  return isUuid ? <Download linkUuid={params.linkUuid} /> : "Invalid"
}
