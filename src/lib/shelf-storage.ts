/**
 * Shelf storage utilities for localStorage persistence
 */

export interface ShelfItem {
  itemId: string
  x: number // Position on shelf (0-1 normalized)
  y: number // Position on shelf (0-1 normalized)
  shelfIndex: number // Which shelf (0-based index)
  column: 'narrow' | 'wide' // Which column
  rotation?: number // Rotation in degrees (0-360)
}

export interface ShelfState {
  items: ShelfItem[]
  version?: number // For future migrations
}

const STORAGE_KEY = '606-shelf-state'
const DEFAULT_STATE: ShelfState = {
  items: [],
  version: 1,
}

/**
 * Save shelf state to localStorage
 */
export function saveShelfState(state: ShelfState): void {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving shelf state:', error)
  }
}

/**
 * Load shelf state from localStorage
 */
export function loadShelfState(): ShelfState | null {
  try {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as ShelfState
    // Validate structure
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
      return parsed
    }
    return null
  } catch (error) {
    console.error('Error loading shelf state:', error)
    return null
  }
}

/**
 * Clear shelf state from localStorage
 */
export function clearShelfState(): void {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing shelf state:', error)
  }
}

/**
 * Get initial shelf state (load from storage or return default)
 */
export function getInitialShelfState(): ShelfState {
  const loaded = loadShelfState()
  return loaded || DEFAULT_STATE
}

