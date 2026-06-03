export enum EPriority {
	Low = 'LOW',
	Medium = 'MEDIUM',
	High = 'HIGH'
}

export enum ETaskStatus {
  Active = 'ACTIVE',
  Done = 'DONE'
}

export interface ITask {
	id: string
	name: string
	priority: EPriority | null
	dueDate: string | null
	order: string
	createdAt: string
	updatedAt: string
	columnId: string
	status: ETaskStatus
	isArchived: boolean
	completedAt: string
	archivedAt: string
}

export interface IColumn {
	id: string
	title: string
	order: string
	tasks: ITask[]
	createdAt: string
	updatedAt: string
	boardId: string,
	isDoneColumn: boolean
}

export interface Board {
	id: string
	title: string
	columns: IColumn[]
	createdAt: string
	updatedAt: string
	userId: string
}
