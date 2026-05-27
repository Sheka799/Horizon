export function isOverdueOrToday(dateString: string): boolean {
	const dueDate = new Date(dateString)
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return dueDate <= today
}
