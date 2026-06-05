import { describe, it, expect } from 'vitest'
import { ugSearchUrl } from '../utils/ugUrl'

describe('ugSearchUrl', () => {
  it('builds a search URL from a song title', () => {
    expect(ugSearchUrl('Amazing Grace')).toBe(
      'https://www.ultimate-guitar.com/search.php?search_type=title&value=Amazing%20Grace'
    )
  })

  it('handles special characters', () => {
    expect(ugSearchUrl('10,000 Reasons (Bless the Lord)')).toBe(
      'https://www.ultimate-guitar.com/search.php?search_type=title&value=10%2C000%20Reasons%20(Bless%20the%20Lord)'
    )
  })
})
