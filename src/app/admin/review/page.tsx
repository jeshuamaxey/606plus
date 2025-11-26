import Link from 'next/link'
import {getTasks} from './tasks'
import {TasksList} from './tasks-list'
import {ReviewTasksButton} from './review-tasks-button'

export const dynamic = 'force-dynamic'

export default async function AdminReviewIndexPage() {
  const {incomplete, completed} = await getTasks()
  
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Admin Review</h1>
          <p className="text-zinc-600">Review and manage content in the CMS</p>
        </div>
        
        {/* Tasks Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">Tasks</h2>
            <ReviewTasksButton />
          </div>
          <TasksList incomplete={incomplete} completed={completed} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/admin/review/items"
            className="group rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 text-2xl font-semibold text-zinc-900 group-hover:text-blue-600">
              Items
            </div>
            <p className="text-sm text-zinc-600">
              Review and publish catalogue items
            </p>
          </Link>
          
          <Link
            href="/admin/review/brands"
            className="group rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 text-2xl font-semibold text-zinc-900 group-hover:text-blue-600">
              Brands
            </div>
            <p className="text-sm text-zinc-600">
              Review brand information
            </p>
          </Link>
          
          <Link
            href="/admin/review/designers"
            className="group rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 text-2xl font-semibold text-zinc-900 group-hover:text-blue-600">
              Designers
            </div>
            <p className="text-sm text-zinc-600">
              Review designer information
            </p>
          </Link>
        </div>
        
        <div className="mt-8">
          <Link
            href="/cms"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Open Sanity CMS
          </Link>
        </div>
      </div>
    </div>
  )
}
