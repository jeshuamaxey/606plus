'use server'

import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
})

export async function publishItem(draftId: string): Promise<{success: boolean; error?: string}> {
  try {
    // Get the draft document (draftId should already include 'drafts.' prefix)
    const draft = await client.fetch(`*[_id == $id][0]`, {id: draftId})
    
    if (!draft) {
      return {success: false, error: 'Draft not found'}
    }
    
    // Remove the draft prefix from _id to get the published document ID
    const publishedId = draftId.replace(/^drafts\./, '')
    
    // Remove _id and _rev from draft to create a new published document
    const {_id, _rev, ...draftData} = draft
    
    // Create or replace the published document
    await client.createOrReplace({
      ...draftData,
      _id: publishedId,
      _type: draft._type,
    })
    
    // Delete the draft
    await client.delete(draftId)
    
    return {success: true}
  } catch (error: any) {
    console.error('Error publishing item:', error)
    return {success: false, error: error.message || 'Failed to publish'}
  }
}

