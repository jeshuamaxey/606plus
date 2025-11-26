'use server'

import {createClient} from '@sanity/client'
import type {Item} from './items/page'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
})

// Helper function to get missing fields (duplicated from page.tsx for server action)
function getMissingFields(item: Item): string[] {
  const missing: string[] = []
  
  if (!item.images || item.images.length === 0) {
    missing.push('images')
  }
  
  if (!item.name || item.name.trim().length === 0) {
    missing.push('name')
  }
  
  if (!item.description || item.description.trim().length < 200) {
    missing.push('description')
  }
  
  if (!item.brand || !item.brand.name) {
    missing.push('brand')
  }
  
  if (!item.category || !item.category.name) {
    missing.push('category')
  }
  
  return missing.sort() // Sort for consistent comparison
}

export async function publishItem(draftId: string): Promise<{success: boolean; error?: string}> {
  try {
    // Get the draft document (draftId should already include 'drafts.' prefix)
    const draft = await client.fetch(`*[_id == $id][0]`, {id: draftId})
    
    if (!draft) {
      return {success: false, error: 'Draft not found'}
    }
    
    // Remove the draft prefix from _id to get the published document ID
    const publishedId = draftId.replace(/^drafts\./, '')
    
    // Find and update any tasks that reference the draft ID to reference the published ID instead
    // This prevents Sanity from blocking the draft deletion due to referential integrity
    const tasksReferencingDraft = await client.fetch<Array<{_id: string}>>(
      `*[_type == "task" && item._ref == $draftId] {_id}`,
      {draftId}
    )
    
    // Update all tasks to reference the published ID instead of the draft ID
    for (const task of tasksReferencingDraft) {
      try {
        await client.patch(task._id).set({
          item: {
            _type: 'reference',
            _ref: publishedId,
          },
        }).commit()
      } catch (error: any) {
        console.error(`Failed to update task ${task._id}:`, error)
        // Continue with other tasks even if one fails
      }
    }
    
    // Remove _id and _rev from draft to create a new published document
    const {_id, _rev, ...draftData} = draft
    
    // Create or replace the published document
    await client.createOrReplace({
      ...draftData,
      _id: publishedId,
      _type: draft._type,
    })
    
    // Delete the draft (should now work since no tasks reference it)
    await client.delete(draftId)
    
    return {success: true}
  } catch (error: any) {
    console.error('Error publishing item:', error)
    return {success: false, error: error.message || 'Failed to publish'}
  }
}

export async function unpublishItem(publishedId: string): Promise<{success: boolean; error?: string}> {
  try {
    // Get the published document
    const published = await client.fetch(`*[_id == $id][0]`, {id: publishedId})
    
    if (!published) {
      return {success: false, error: 'Published document not found'}
    }
    
    // Create a draft version by copying the published document with drafts. prefix
    const draftId = `drafts.${publishedId}`
    
    // Remove _id and _rev from published to create a draft
    const {_id, _rev, ...publishedData} = published
    
    // Create the draft document
    await client.createOrReplace({
      ...publishedData,
      _id: draftId,
      _type: published._type,
    })
    
    // Delete the published document
    await client.delete(publishedId)
    
    return {success: true}
  } catch (error: any) {
    console.error('Error unpublishing item:', error)
    return {success: false, error: error.message || 'Failed to unpublish'}
  }
}

export async function reviewTasks(): Promise<{
  success: boolean
  created: number
  completed: number
  errors: string[]
}> {
  const errors: string[] = []
  let created = 0
  let completed = 0

  try {
    // Fetch all items (both published and drafts) with creation date
    const itemsQuery = `*[_type == "item"] {
      _id,
      _createdAt,
      number,
      name,
      images,
      category->{_id, _type, name},
      designer->{_id, _type, name},
      brand->{_id, _type, name},
      yearStart,
      yearEnd,
      description
    }`
    
    const allItems = await client.fetch<Array<Item & {_createdAt: string}>>(itemsQuery)
    
    // Group items by published ID (remove drafts. prefix)
    // For each published ID, keep the most recently created draft, or the published version
    const itemsByPublishedId = new Map<string, Item & {_createdAt: string}>()
    
    for (const item of allItems) {
      const isDraft = item._id.startsWith('drafts.')
      const publishedId = isDraft ? item._id.replace(/^drafts\./, '') : item._id
      
      const existing = itemsByPublishedId.get(publishedId)
      
      if (!existing) {
        // First item for this published ID
        itemsByPublishedId.set(publishedId, item)
      } else {
        // If current is a draft and existing is published, use draft
        // If both are drafts, use the most recent one
        // If current is published and existing is draft, keep draft (it's newer)
        if (isDraft && !existing._id.startsWith('drafts.')) {
          // Current is draft, existing is published - use draft
          itemsByPublishedId.set(publishedId, item)
        } else if (isDraft && existing._id.startsWith('drafts.')) {
          // Both are drafts - use the most recent one
          if (new Date(item._createdAt) > new Date(existing._createdAt)) {
            itemsByPublishedId.set(publishedId, item)
          }
        }
        // If current is published and existing is draft, keep existing (draft is newer)
      }
    }
    
    // Convert map to array, using published ID for reference
    const items = Array.from(itemsByPublishedId.entries()).map(([publishedId, item]) => ({
      ...item,
      _publishedId: publishedId, // Store the published ID for task references
    })) as Array<Item & {_createdAt: string; _publishedId: string}>
    
    // Fetch all existing incomplete tasks
    const incompleteTasksQuery = `*[_type == "task" && completed == false] {
      _id,
      item->{_id},
      missingFields
    }`
    
    const incompleteTasks = await client.fetch<Array<{
      _id: string
      item: {_id: string} | null
      missingFields: string[]
    }>>(incompleteTasksQuery)
    
    // Create a map of published item ID to existing tasks
    // Normalize task item IDs to published IDs (remove drafts. prefix)
    // Also fix any tasks that reference draft IDs by updating them to reference published IDs
    const itemTaskMap = new Map<string, Array<{_id: string; missingFields: string[]}>>()
    
    for (const task of incompleteTasks) {
      if (task.item?._id) {
        const isDraftReference = task.item._id.startsWith('drafts.')
        // Normalize to published ID
        const publishedId = isDraftReference
          ? task.item._id.replace(/^drafts\./, '')
          : task.item._id
        
        // If task references a draft, update it to reference the published ID
        if (isDraftReference) {
          try {
            await client.patch(task._id).set({
              item: {
                _type: 'reference',
                _ref: publishedId,
              },
            }).commit()
          } catch (error: any) {
            console.error(`Failed to fix task ${task._id} reference:`, error)
            errors.push(`Failed to fix task ${task._id} reference: ${error.message}`)
          }
        }
        
        if (!itemTaskMap.has(publishedId)) {
          itemTaskMap.set(publishedId, [])
        }
        itemTaskMap.get(publishedId)!.push({
          _id: task._id,
          missingFields: [...task.missingFields].sort(),
        })
      }
    }
    
    // Process each item (using the selected version)
    for (const item of items) {
      const publishedId = item._publishedId
      const missingFields = getMissingFields(item)
      
      // If item is incomplete, check if task exists
      if (missingFields.length > 0) {
        const sortedMissing = [...missingFields].sort()
        const existingTasks = itemTaskMap.get(publishedId) || []
        
        // Check if a task with the exact same missing fields exists
        const matchingTask = existingTasks.find(
          (task) => JSON.stringify(task.missingFields) === JSON.stringify(sortedMissing)
        )
        
        if (!matchingTask) {
          // Create new task referencing the published ID
          try {
            await client.create({
              _type: 'task',
              item: {
                _type: 'reference',
                _ref: publishedId,
              },
              missingFields: sortedMissing,
              completed: false,
            })
            created++
          } catch (error: any) {
            errors.push(`Failed to create task for item ${publishedId}: ${error.message}`)
          }
        }
      }
      
      // Check existing incomplete tasks for this item
      const itemTasks = itemTaskMap.get(publishedId) || []
      for (const task of itemTasks) {
        // Check if all missing fields in the task are now present
        const allFieldsPresent = task.missingFields.every((field) => {
          switch (field) {
            case 'images':
              return item.images && item.images.length > 0
            case 'name':
              return item.name && item.name.trim().length > 0
            case 'description':
              return item.description && item.description.trim().length >= 300
            case 'brand':
              return item.brand && item.brand.name
            case 'category':
              return item.category && item.category.name
            default:
              return false
          }
        })
        
        if (allFieldsPresent) {
          // Mark task as complete
          try {
            await client.patch(task._id).set({
              completed: true,
              completedAt: new Date().toISOString(),
            }).commit()
            completed++
          } catch (error: any) {
            errors.push(`Failed to complete task ${task._id}: ${error.message}`)
          }
        }
      }
    }
    
    return {
      success: true,
      created,
      completed,
      errors,
    }
  } catch (error: any) {
    console.error('Error reviewing tasks:', error)
    return {
      success: false,
      created,
      completed,
      errors: [...errors, `Review failed: ${error.message}`],
    }
  }
}

export async function deleteTask(taskId: string): Promise<{success: boolean; error?: string}> {
  try {
    await client.delete(taskId)
    return {success: true}
  } catch (error: any) {
    console.error('Error deleting task:', error)
    return {success: false, error: error.message || 'Failed to delete task'}
  }
}

/**
 * Fix all tasks that reference draft item IDs by updating them to reference published IDs.
 * This prevents publishing failures due to referential integrity constraints.
 */
export async function fixTaskReferences(): Promise<{
  success: boolean
  fixed: number
  errors: string[]
}> {
  const errors: string[] = []
  let fixed = 0

  try {
    // Fetch all tasks (both incomplete and completed) that reference draft item IDs
    // We fetch all tasks and filter for those referencing drafts
    const allTasks = await client.fetch<Array<{
      _id: string
      item: {_id: string} | null
    }>>(
      `*[_type == "task" && defined(item._ref)] {
        _id,
        item->{_id}
      }`
    )
    
    // Filter to only tasks that reference draft IDs
    const tasksWithDraftReferences = allTasks.filter(
      (task) => task.item?._id && task.item._id.startsWith('drafts.')
    )

    for (const task of tasksWithDraftReferences) {
      if (task.item?._id && task.item._id.startsWith('drafts.')) {
        const publishedId = task.item._id.replace(/^drafts\./, '')
        
        try {
          await client.patch(task._id).set({
            item: {
              _type: 'reference',
              _ref: publishedId,
            },
          }).commit()
          fixed++
        } catch (error: any) {
          const errorMsg = `Failed to fix task ${task._id}: ${error.message}`
          console.error(errorMsg, error)
          errors.push(errorMsg)
        }
      }
    }

    return {
      success: true,
      fixed,
      errors,
    }
  } catch (error: any) {
    console.error('Error fixing task references:', error)
    return {
      success: false,
      fixed,
      errors: [...errors, `Fix failed: ${error.message}`],
    }
  }
}

