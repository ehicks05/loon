import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playlists/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/playlists/$id"!</div>
}
