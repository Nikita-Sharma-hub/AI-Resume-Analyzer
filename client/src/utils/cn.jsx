export function cn(...parts) {
  return parts
    .flatMap((p) => {
      if (!p) return []
      if (typeof p === 'string') return [p]
      if (Array.isArray(p)) return p.filter(Boolean)
      if (typeof p === 'object') return Object.keys(p).filter((k) => Boolean(p[k]))
      return []
    })
    .join(' ')
}

