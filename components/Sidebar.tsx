'use client'

import { SubscriptionContext } from '@/app/_providers'
import useDragging from '@/hooks/useDragging'
import { closeSidebar } from '@/utils/functions'
import type { ChannelProps, ChannelType } from '@/utils/types'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useContext, useRef } from 'react'
import Avatar from './Avatar'

const MenuItem = ({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) => (
	<Link
		className={`
			px-2 text-base active:bg-gray-200 active:text-black
			${className}
		`}
		href={href}
		onClick={closeSidebar}
		draggable="false"
	>
		{children}
	</Link>
)

const Menu = ({
	title,
	channels,
	active_route,
	onTrashBtnClicked,
}: {
	title: string
	channels: ChannelProps[]
	active_route: string | undefined
	onTrashBtnClicked: () => void
}) => (
	<>
		{channels.length > 0 && (
			<li className="menu-title !px-2">
				<div className="flex items-center justify-between">
					<span>{title}</span>
					<TrashIcon
						className="w-4 h-4 transition-opacity opacity-0 cursor-pointer hover:opacity-100"
						onClick={onTrashBtnClicked}
					/>
				</div>
			</li>
		)}
		<div className="space-y-2">
			{channels.map(({ channel_name, channel_route, channel_image, is_user_channel }, i) => (
				<li key={i}>
					<MenuItem
						className={channel_route === active_route ? 'bg-gray-100' : ''}
						href={`/channels/${is_user_channel ? `@${channel_name}` : channel_route}`}
					>
						<Image
							className={is_user_channel ? 'rounded-full' : 'rounded'}
							src={channel_image}
							alt={channel_name}
							width={32}
							height={32}
							draggable="false"
							unoptimized
						/>
						<span>{channel_name}</span>
					</MenuItem>
				</li>
			))}
		</div>
	</>
)

const ModalButton = ({ label }: { label: string }) => (
	<button className="p-0 btn btn-link btn-xs text-primary" onClick={() => window.LoginModal.showModal()}>
		{label}
	</button>
)

const Sidebar = () => {
	// 获取所有频道信息
	const { userChannels, publicChannels, subscribe, unSubscribeAll } = useContext(SubscriptionContext)
	// 用户登录信息
	const { data: session } = useSession()
	// 当前路由信息
	const pathname = usePathname()
	// 拖拽相关
	const dropZoneRef = useRef<HTMLDivElement>(null)
	const [isDragging, isDragOver] = useDragging({
		dropZoneRef: dropZoneRef,
		onDragDrop: (e: DragEvent) => {
			const data = e.dataTransfer?.getData('text').split('_')
			if (data) {
				const channel_type = data[0] as ChannelType
				const channel_id = Number(data[1])
				subscribe(channel_id, channel_type)
			}
		},
	})

	return (
		<section className="flex flex-col min-h-screen bg-white w-60">
			{/* session: undefined | null | object */}
			{session !== undefined && userChannels && publicChannels ? (
				<>
					<div className="flex flex-row items-center gap-4 p-4 lg:pt-8 lg:flex-col">
						<Link
							className="transition-all rounded-full hover:shadow-xl"
							href="/me"
							draggable="false"
							onClick={(e) => {
								if (session === null) {
									e.preventDefault()
									window.LoginModal.showModal()
								}
							}}
						>
							<Avatar className="w-16 h-16 lg:w-[176px] lg:h-[176px]" />
						</Link>
						<div className="text-2xl">{session ? session.user?.name : '游客'}</div>
					</div>
					<div className="px-5">
						{session === null && (
							<div className="text-xs text-gray-500">
								<ModalButton label="登录" />
								<span className="mx-1">或</span>
								<ModalButton label="注册" />
								<span>，</span>
								<span className="block">以保存你的关注列表。</span>
							</div>
						)}
					</div>
					{isDragging ? (
						<div
							className={`
								${isDragOver ? 'border-primary text-primary' : ''}
								border-2 border-dashed rounded-xl
								text-gray-500
								mx-2 my-4 pt-20
								flex-1
							`}
							ref={dropZoneRef}
						>
							<PlusIcon className="w-24 h-24 mx-auto opacity-70" />
							<span className="block text-center">将频道拖到这里以关注</span>
						</div>
					) : (
						<ul className="pb-8 menu">
							{userChannels.length === 0 && publicChannels.length === 0 && (
								<MenuItem
									className="flex items-center justify-center gap-1 p-3 mx-2 text-gray-500 transition-all border-2 border-dashed rounded-xl active:text-gray-500"
									href="/channels"
								>
									<PlusIcon className="w-6 h-6" />
									<span>发现更多频道</span>
								</MenuItem>
							)}
							{userChannels.length > 0 && (
								<Menu
									title="关注的UP"
									channels={userChannels}
									active_route={pathname}
									onTrashBtnClicked={() => unSubscribeAll('user-channels')}
								/>
							)}
							{publicChannels.length > 0 && (
								<Menu
									title="关注的频道"
									channels={publicChannels}
									active_route={pathname}
									onTrashBtnClicked={() => unSubscribeAll('public-channels')}
								/>
							)}
						</ul>
					)}
				</>
			) : (
				<div role="status" className="animate-pulse">
					<div className="flex flex-row items-center gap-4 p-4 lg:pt-8 lg:flex-col">
						<div className="w-16 h-16 lg:w-[176px] lg:h-[176px] flex items-center justify-center rounded-full bg-gray-200">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 640 512"
								className="w-8 h-8 text-gray-100 lg:w-12 lg:h-12"
							>
								<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
							</svg>
						</div>
						<div className="flex-1 h-8 bg-gray-200 w-28 lg:flex-none rounded-xl"></div>
					</div>
					<div className="flex flex-col gap-4 mx-4 lg:mt-8">
						<div className="h-8 bg-gray-200 rounded-xl"></div>
						<div className="h-8 bg-gray-200 rounded-xl"></div>
						<div className="h-8 bg-gray-200 rounded-xl"></div>
						<div className="h-8 bg-gray-200 rounded-xl"></div>
						<div className="h-8 bg-gray-200 rounded-xl"></div>
						<div className="h-8 bg-gray-200 rounded-xl"></div>
					</div>
					<span className="sr-only">Loading...</span>
				</div>
			)}
		</section>
	)
}

export default Sidebar
