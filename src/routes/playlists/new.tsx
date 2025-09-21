import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playlists/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/playlists/new"!</div>
}
