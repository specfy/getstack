import { createRootRoute } from '@tanstack/react-router'
import { Index } from './index'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <Index />
    </div>
  ),
}) 