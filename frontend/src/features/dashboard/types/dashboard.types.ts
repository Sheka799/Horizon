export enum EPriority {
	Low = 'LOW',
	Medium = 'MEDIUM',
	High = 'HIGH'
}

export interface ITask {
	id: string
	name: string
	priority: EPriority | null
	isCompleted: boolean
	dueDate: Date | null
	order: string
	createdAt: string
	updatedAt: string
	columnId: string
}

export interface IColumn {
	id: string
	title: string
	order: string
	tasks: ITask[]
	createdAt: string
	updatedAt: string
	boardId: string
}

export interface Board {
	id: string
	title: string
	columns: IColumn[]
	createdAt: string
	updatedAt: string
	userId: string
}
