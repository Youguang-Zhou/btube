import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

interface useDraggingProps {
	dropZoneRef: RefObject<HTMLDivElement>
	onDragDrop: (e: DragEvent) => void
}

const useDragging = ({ dropZoneRef, onDragDrop }: useDraggingProps) => {
	const [isDragging, setIsDragging] = useState(false)
	const [isDragOver, setIsDragOver] = useState(false)

	useEffect(() => {
		const handleDragStartEvent = (e: DragEvent) => {
			const element = e.target as HTMLImageElement
			if (element.id !== '') {
				setIsDragging(true)
				e.dataTransfer?.setData('text/plain', element.id)
			}
		}
		const handleDragOverEvent = (e: DragEvent) => {
			e.preventDefault()
			setIsDragOver(true)
		}
		const handleDragLeaveEvent = () => {
			setIsDragOver(false)
		}
		const handleDragDropEvent = (e: DragEvent) => {
			e.preventDefault()
			setIsDragging(false)
			setIsDragOver(false)
			onDragDrop(e)
		}
		const handleDragEndEvent = () => {
			setIsDragging(false)
		}
		const dropZone = dropZoneRef.current
		window.addEventListener('dragstart', handleDragStartEvent)
		dropZone?.addEventListener('dragover', handleDragOverEvent)
		dropZone?.addEventListener('dragleave', handleDragLeaveEvent)
		dropZone?.addEventListener('drop', handleDragDropEvent)
		window.addEventListener('dragend', handleDragEndEvent)
		return () => {
			window.removeEventListener('dragstart', handleDragStartEvent)
			dropZone?.removeEventListener('dragover', handleDragOverEvent)
			dropZone?.removeEventListener('dragleave', handleDragLeaveEvent)
			dropZone?.removeEventListener('drop', handleDragDropEvent)
			window.addEventListener('dragend', handleDragEndEvent)
		}
	}, [isDragging, dropZoneRef, onDragDrop])

	return [isDragging, isDragOver]
}

export default useDragging
