import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef } from 'react'

interface InfiniteScrollProps {
	children?: ReactNode
	hasMore: boolean
	isLoading: boolean
	loadMore: () => void
}

// 通过IntersectionObserver实现无限滚动，
// 详见：https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
const InfiniteScroll = ({ children, hasMore, isLoading, loadMore }: InfiniteScrollProps) => {
	const observerRef = useRef<HTMLDivElement>(null)
	const scroll = useCallback(
		(entries: IntersectionObserverEntry[]) => entries[0].isIntersecting && hasMore && !isLoading && loadMore(),
		[hasMore, isLoading, loadMore]
	)

	useEffect(() => {
		const observer = new IntersectionObserver(scroll)
		observerRef.current && observer.observe(observerRef.current)
		return () => observer.disconnect()
	}, [observerRef, scroll])

	return (
		<>
			{children}
			{hasMore && (
				// 把观察点绑定到 Loading 组件上
				<div ref={observerRef}>
					<span className="block mx-auto mt-4 lg:mt-8 loading loading-spinner loading-lg text-primary" />
				</div>
			)}
		</>
	)
}

export default InfiniteScroll
