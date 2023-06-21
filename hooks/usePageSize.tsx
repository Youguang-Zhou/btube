import { useEffect, useState } from 'react'
import useDesktop from './useDesktop'

const usePageSize = () => {
	const [pageSize, setPageSize] = useState<number | undefined>(undefined)
	const isDesktop = useDesktop()

	useEffect(() => {
		setPageSize(isDesktop ? 12 : 6)
	}, [isDesktop])

	return pageSize
}

export default usePageSize
