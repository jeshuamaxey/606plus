import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
})

export interface Task {
  _id: string
  _createdAt: string
  item: {
    _id: string
    number?: number
    name?: string
  }
  missingFields: string[]
  completed: boolean
  completedAt?: string
}

export async function getTasks(): Promise<{
  incomplete: Task[]
  completed: Task[]
}> {
  try {
    // Calculate date 72 hours ago
    const seventyTwoHoursAgo = new Date()
    seventyTwoHoursAgo.setHours(seventyTwoHoursAgo.getHours() - 72)
    const cutoffDate = seventyTwoHoursAgo.toISOString()
    
    // Fetch incomplete tasks
    const incompleteQuery = `*[_type == "task" && completed == false] | order(_createdAt asc) {
      _id,
      _createdAt,
      item->{
        _id,
        number,
        name
      },
      missingFields,
      completed
    }`
    
    // Fetch completed tasks from last 72 hours
    const completedQuery = `*[_type == "task" && completed == true && completedAt >= $cutoffDate] | order(completedAt desc) {
      _id,
      _createdAt,
      item->{
        _id,
        number,
        name
      },
      missingFields,
      completed,
      completedAt
    }`
    
    const [incomplete, completed] = await Promise.all([
      client.fetch<Task[]>(incompleteQuery),
      client.fetch<Task[]>(completedQuery, {cutoffDate}),
    ])
    
    return {
      incomplete: incomplete || [],
      completed: completed || [],
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return {
      incomplete: [],
      completed: [],
    }
  }
}

