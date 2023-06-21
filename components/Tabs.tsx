'use client'

import type { HTMLProps, ReactElement, ReactNode } from 'react'
import { Children, useEffect, useRef, useState } from 'react'

const Tab = ({ label, icon }: { label: string; icon: ReactNode; content: ReactNode }) => (
	<div className="flex items-center gap-1">
		<span className="w-6 h-6">{icon}</span>
		<span>{label}</span>
	</div>
)

const Tabs = ({ children, ...props }: HTMLProps<HTMLDivElement>) => {
	const [currTabIndex, setCurrTabIndex] = useState(0)
	const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0)
	const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0)
	const tabsRef = useRef<HTMLButtonElement[]>([])

	useEffect(() => {
		const setTabPosition = () => {
			const currentTab = tabsRef.current[currTabIndex]
			setTabUnderlineLeft(currentTab?.offsetLeft ?? 0)
			setTabUnderlineWidth(currentTab?.clientWidth ?? 0)
		}
		setTabPosition()
		window.addEventListener('resize', setTabPosition)
		return () => window.removeEventListener('resize', setTabPosition)
	}, [currTabIndex])

	return (
		<div {...props}>
			<div className="relative mb-4 lg:mb-8">
				<div className="flex flex-wrap space-x-4 border-b lg:space-x-6">
					{Children.map(children, (child, idx) => (
						<button
							key={idx}
							className={`
								${currTabIndex === idx ? 'text-primary' : ''}
								p-2 hover:text-primary 
							`}
							ref={(el) => {
								if (el) {
									tabsRef.current[idx] = el
								}
							}}
							onClick={() => setCurrTabIndex(idx)}
						>
							{child}
						</button>
					))}
				</div>
				<span
					className="absolute bottom-0 h-1 transition-all duration-300 bg-primary"
					style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
				/>
			</div>
			{Children.map(children, (child, i) => i === currTabIndex && <>{(child as ReactElement).props.content}</>)}
		</div>
	)
}

export { Tab, Tabs }
