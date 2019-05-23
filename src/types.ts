type Completed = boolean

enum Priority {
  Low = 1,
  Medium = 2,
  High = 3
}

enum Difficulty {
  Low = 1,
  Medium = 2,
  High = 3
}

export interface Quest {
  id: number
  name: string
  difficulty: Difficulty
  priority: Priority
  state: Completed
}

export interface Items {
  label: string
  value: string
}

export interface MainState {
  status: string
  quests: Quest[]
  quests_select: Items[]
  input: string
  view: 'quests' | 'edit'
  selected_quest: Quest | null
  error: string
  label: string
  current_edit: number
}
