import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to StackHub</h1>
      <p className="mt-2">Your repository analysis platform</p>
    </div>
  )
} 