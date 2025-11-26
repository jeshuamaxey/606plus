'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import Link from 'next/link'
import {Task} from './tasks'
import {deleteTask} from './actions'

interface TasksListProps {
  incomplete: Task[]
  completed: Task[]
}

const fieldLabels: Record<string, string> = {
  images: 'Images',
  name: 'Name',
  description: 'Description',
  brand: 'Brand',
  category: 'Category',
}

export function TasksList({incomplete, completed}: TasksListProps) {
  const router = useRouter()
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }
  
  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }
    
    const result = await deleteTask(taskId)
    
    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to delete task: ${result.error}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Incomplete Tasks Section */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">
          Incomplete Tasks ({incomplete.length})
        </h2>
        {incomplete.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow text-center text-zinc-500">
            No incomplete tasks
          </div>
        ) : (
          <div className="space-y-2">
            {incomplete.map((task) => (
              <div
                key={task._id}
                className="rounded-lg bg-white p-4 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {task.item?._id ? (
                        <Link
                          href={`/cms/desk/item;${task.item._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-zinc-900 hover:text-blue-600"
                        >
                          {task.item?.number ? `#${task.item.number}: ` : ''}
                          {task.item?.name || 'Unknown Item'}
                        </Link>
                      ) : (
                        <span className="font-medium text-zinc-900">
                          {task.item?.number ? `#${task.item.number}: ` : ''}
                          {task.item?.name || 'Unknown Item'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.missingFields.map((field) => (
                        <span
                          key={field}
                          className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
                        >
                          {fieldLabels[field] || field}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="ml-4 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                    title="Delete task"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks Section */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-zinc-500 mb-4">
            Recently Completed ({completed.length})
          </h2>
          <div className="space-y-2">
            {completed.map((task) => (
              <div
                key={task._id}
                className="rounded-lg bg-white p-4 shadow opacity-60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-zinc-600">
                        {task.item?.number ? `#${task.item.number}: ` : ''}
                        {task.item?.name || 'Unknown Item'}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {task.completedAt ? formatDate(task.completedAt) : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.missingFields.map((field) => (
                        <span
                          key={field}
                          className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600"
                        >
                          {fieldLabels[field] || field}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="ml-4 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors opacity-60 hover:opacity-100"
                    title="Delete task"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

