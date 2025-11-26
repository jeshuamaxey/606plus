'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {reviewTasks} from './actions'

export function ReviewTasksButton() {
  const router = useRouter()
  const [isReviewing, setIsReviewing] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  
  async function handleReview() {
    setIsReviewing(true)
    setMessage(null)
    
    try {
      const result = await reviewTasks()
      
      if (result.success) {
        const parts = []
        if (result.created > 0) {
          parts.push(`Created ${result.created} new task${result.created !== 1 ? 's' : ''}`)
        }
        if (result.completed > 0) {
          parts.push(`Completed ${result.completed} task${result.completed !== 1 ? 's' : ''}`)
        }
        if (parts.length === 0) {
          parts.push('No changes needed')
        }
        
        setMessage({
          type: 'success',
          text: parts.join(', '),
        })
        
        // Refresh the page to show updated tasks
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to review tasks',
        })
      }
      
      if (result.errors.length > 0) {
        console.error('Task review errors:', result.errors)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error: ${error instanceof Error ? error.message : 'Failed to review tasks'}`,
      })
    } finally {
      setIsReviewing(false)
    }
  }
  
  return (
    <div className="flex items-center gap-3">
      {message && (
        <span
          className={`text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </span>
      )}
      <button
        onClick={handleReview}
        disabled={isReviewing}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed"
      >
        {isReviewing ? 'Reviewing...' : 'Review Tasks'}
      </button>
    </div>
  )
}

