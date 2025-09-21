import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playlists/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/playlists/$id/edit"!</div>
}
