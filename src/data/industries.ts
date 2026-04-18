export interface Industry {
  id: string
  name: string
  emoji: string
}

export const industries: Industry[] = [
  { id: 'food', name: '飲食', emoji: '🍽' },
  { id: 'manufacturing', name: '製造', emoji: '🏭' },
  { id: 'cleaning', name: '清掃', emoji: '🧹' },
  { id: 'medical', name: '医療', emoji: '🏥' },
  { id: 'hotel', name: '宿泊', emoji: '🏨' },
  { id: 'construction', name: '建設', emoji: '🏗' },
  { id: 'retail', name: '小売', emoji: '🛒' },
  { id: 'education', name: '教育', emoji: '📚' },
]
