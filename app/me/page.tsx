'use client'

import {
	BookmarkSquareIcon,
	ClockIcon,
	HeartIcon,
	IdentificationIcon,
	LockClosedIcon,
	PowerIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import HomePage from './_page_home'
import SecurityPage from './_page_security'
import SignOutPage from './_page_signout'

const categories = [
	{
		title: '账号',
		items: [
			{
				icon: <IdentificationIcon className="w-7 h-7" />,
				span: <span>个人信息</span>,
				page: <HomePage />,
			},
			{
				icon: <LockClosedIcon className="w-7 h-7" />,
				span: <span>账号安全</span>,
				page: <SecurityPage />,
			},
			{
				icon: <PowerIcon className="w-7 h-7" />,
				span: <span>退出登录</span>,
				page: <SignOutPage />,
			},
		],
	},
	{
		title: '媒体库',
		items: [
			{
				icon: <HeartIcon className="w-7 h-7" />,
				span: <span>赞过的视频</span>,
				page: <div>赞过的视频页面开发中</div>,
			},
			{
				icon: <BookmarkSquareIcon className="w-7 h-7" />,
				span: <span>收藏的视频</span>,
				page: <div>收藏的视频页面开发中</div>,
			},
			{
				icon: <ClockIcon className="w-7 h-7" />,
				span: <span>历史记录</span>,
				page: <div>历史记录页面开发中</div>,
			},
		],
	},
]

const MePage = () => {
	const { data: session } = useSession()
	const [currIndex, setCurrIndex] = useState(0)

	if (session === null) {
		redirect('/')
	}

	return session && session.user ? (
		<>
			{/* 桌面端 */}
			<div className="justify-center hidden m-8 lg:flex">
				<ul className="min-h-[80vh] border-r w-60 menu menu-lg">
					{categories.map(({ title, items }, titleKey) => (
						<div key={titleKey}>
							<li className="text-xl menu-title">{title}</li>
							{items.map(({ icon, span }, itemKey) => {
								if (titleKey === 1) {
									itemKey = categories[0].items.length + itemKey
								}
								return (
									<li key={itemKey} onClick={() => setCurrIndex(itemKey)}>
										<a className={currIndex === itemKey ? 'active' : ''}>
											{icon}
											{span}
										</a>
									</li>
								)
							})}
						</div>
					))}
				</ul>
				<div className="p-12 lg:w-2/3 xl:w-1/2">
					{categories
						.map(({ items }) => items.map(({ page }) => page))
						.flat()
						.map(
							(page, i) =>
								currIndex === i && (
									<div key={i} className="h-full">
										{page}
									</div>
								)
						)}
				</div>
			</div>
			{/* 移动端 */}
			<div
				className="block overflow-scroll snap-y snap-mandatory lg:hidden"
				style={{ height: 'calc((100vh - 60px))' }}
			>
				{categories.map(({ items }, titleKey) => (
					<div
						key={titleKey}
						className="py-6 mx-4 space-y-4 snap-start"
						style={{ height: 'calc((100vh - 60px))' }}
					>
						{items.map(({ span, page }, itemKey) => {
							if (titleKey === 1) {
								itemKey = categories[0].items.length + itemKey
							}
							return (
								<div key={itemKey}>
									<div className="mb-4 text-2xl font-bold text-black/70">{span}</div>
									<div>{page}</div>
								</div>
							)
						})}
					</div>
				))}
			</div>
		</>
	) : (
		<></>
	)
}

export default MePage
