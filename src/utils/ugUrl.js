export function ugSearchUrl(title) {
  return `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(title)}`
}
