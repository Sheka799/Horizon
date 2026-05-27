import { ChevronDown, ChevronUp, Equal } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

interface PriorityWithTooltipProps {
	priority: 'LOW' | 'MEDIUM' | 'HIGH'
	showLabel?: boolean
}

export const PriorityWithTooltip = ({
	priority,
	showLabel = false
}: PriorityWithTooltipProps) => {
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
				<p className='flex items-center gap-1 text-xs'>
					<Icon className={className} />
					{showLabel && <span>{label}</span>}
				</p>
			</TooltipTrigger>
			<TooltipContent>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	)
}
