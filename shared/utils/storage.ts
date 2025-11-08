import type { ExamStore } from '../types/exam'
import { cyrb53 } from './hash'

/**
 * localStorage 的 key
 */
export const STORAGE_KEY = 'nou-mock-exam'

/**
 * 從 localStorage 獲取考試資料
 */
export function getExamStore(): ExamStore | null {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    return null
  }

  try {
    const store = JSON.parse(data)

    // 基本的型別驗證
    if (!store || !Array.isArray(store.blocks)) {
      throw new Error('Invalid store format')
    }

    return store as ExamStore
  } catch {
    // 解析失敗時清除無效資料
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

/**
 * 儲存考試資料到 localStorage
 */
export function setExamStore(store: ExamStore): void {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (error) {
    // 處理 localStorage 配額超出等錯誤
    console.error('Failed to save exam store:', error)
  }
}

/**
 * 清除 localStorage 中的考試資料
 */
export function clearExamStore(): void {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.removeItem(STORAGE_KEY)
}

/**
 * 生成題目的唯一 key
 * 使用 cyrb53 雜湊題目文字作為 key，避免重複
 */
export function getFieldKey(subject: string): string {
  return `${cyrb53(subject)}`
}
