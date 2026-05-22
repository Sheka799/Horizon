import { ChevronDown, ChevronUp, Equal } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

export const PriorityWithTooltip = ({
	priority
}: {
	priority: 'LOW' | 'MEDIUM' | 'HIGH'
}) => {
	const config = {
		LOW: {
			icon: ChevronDown,
			label: 'Низкий',
			className: 'text-muted-foreground'
		},
		MEDIUM: {
			icon: Equal,
			label: 'Средний',
			className: 'text-orange-400/90'
		},
		HIGH: {
			icon: ChevronUp,
			label: 'Высокий',
			className: 'text-red-400/90'
		}
	}

	const { icon: Icon, label, className } = config[priority]

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className='text-xs'>
					<Icon className={className} />
				</span>
			</TooltipTrigger>
			<TooltipContent>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	)
}
