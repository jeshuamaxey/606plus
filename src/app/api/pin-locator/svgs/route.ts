import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public', '606')
    const files = await readdir(publicDir)
    const svgFiles = files.filter((file) => file.toLowerCase().endsWith('.svg'))
    
    return NextResponse.json({ 
      files: svgFiles.sort(),
      path: publicDir,
      totalFiles: files.length,
      svgCount: svgFiles.length
    })
  } catch (error: any) {
    // Directory doesn't exist or other error
    console.error('Error reading SVG directory:', error)
    return NextResponse.json({ 
      files: [],
      error: error.message,
      path: join(process.cwd(), 'public', '606')
    })
  }
}

