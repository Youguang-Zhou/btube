import type { ReactNode } from 'react'

const GradientBackground = ({ children }: { children: ReactNode }) => (
	<div className="bg-gradient-to-t from-current to-transparent">{children}</div>
)

export default GradientBackground
