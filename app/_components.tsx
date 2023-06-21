'use client'

import Avatar from '@/components/Avatar'
import Sidebar from '@/components/Sidebar'
import { closeSidebar } from '@/utils/functions'
import { Bars3Icon, QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { HTMLProps, ReactNode } from 'react'
import { useEffect, useState } from 'react'

export const Navbar = (props: HTMLProps<HTMLElement>) => {
	const pathname = usePathname()
	const routes = [
		{ name: '首页', path: '/' },
		{ name: '频道', path: '/channels' },
	]

	return (
		<nav {...props}>
			{routes.map(({ name, path }, i) => (
				<Link key={i} href={path} className={pathname === path ? 'text-gray-900' : 'text-gray-500'}>
					<span className="text-xl">{name}</span>
				</Link>
			))}
		</nav>
	)
}

export const SearchBar = (props: HTMLProps<HTMLDivElement>) => (
	<div {...props}>
		<div className="flex items-center h-8 px-3 border border-gray-300 shadow rounded-3xl">
			<input className="flex-1 outline-none" name="header-searchbar" placeholder="搜索功能暂时不可用" />
			<button>🔍</button>
		</div>
	</div>
)

export const Header = () => {
	const [toggle, setToggle] = useState(true) // 移动端视角下是否折叠导航栏
	const pathname = usePathname()

	useEffect(() => {
		// 路由变化时折叠导航栏
		setToggle(true)
	}, [pathname])

	return (
		<header className="px-4 py-1 bg-white border-b">
			{/* 桌面端 */}
			<div className="flex items-center justify-between gap-8">
				{/* 移动端logo左侧用户头像按钮 */}
				<label
					className="block lg:hidden hover:cursor-pointer"
					htmlFor="sidebar-drawer"
					onClick={() => setToggle(true)}
				>
					<Avatar className="w-8 h-8" />
				</label>
				<Link
					href="/"
					onClick={() => {
						setToggle(true)
						closeSidebar()
					}}
				>
					<Image src="/assets/logo.png" alt="BiliTube" width={120} height={48} priority />
				</Link>
				<Navbar className="hidden space-x-6 lg:block" />
				<SearchBar className="hidden lg:block flex-1 lg:mx-[15vw] xl:mx-[20vw] 2xl:mx-[25vw]" />
				<Link className="hidden lg:block" href="/aboutus" target="_blank" rel="noopener noreferrer">
					<QuestionMarkCircleIcon className="w-6 h-6" />
				</Link>
				{/* 移动端logo右侧折叠导航栏按钮 */}
				<label className="swap swap-rotate lg:hidden">
					<input
						id="header-toggle"
						type="checkbox"
						className="w-8 h-8"
						onClick={() => {
							setToggle(!toggle)
							closeSidebar()
						}}
						checked={!toggle}
						readOnly
					/>
					<XMarkIcon className="swap-on" />
					<Bars3Icon className="swap-off" />
				</label>
			</div>
			{/* 移动端 */}
			<div
				className={`
					${toggle ? 'max-h-0' : 'max-h-32'}
					block space-y-2 overflow-hidden transition-all lg:hidden
				`}
			>
				<Navbar className="flex justify-evenly" />
				<SearchBar />
			</div>
		</header>
	)
}

export const Footer = () => {
	const pathname = usePathname()

	return (
		<footer className={pathname === '/me' ? 'hidden' : 'my-2 text-center'}>
			<span>© 2023 bili.tube</span>
		</footer>
	)
}

export const DrawerWrap = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname()

	return (
		<div
			className={`
				${
					pathname === '/aboutus' ||
					pathname === '/forget-password' ||
					pathname === '/me' ||
					pathname === '/watch'
						? ''
						: 'lg:drawer-open'
				}
				drawer
			`}
		>
			<input id="sidebar-drawer" className="drawer-toggle" type="checkbox" />
			<div className="drawer-content">{children}</div>
			<div className="drawer-side">
				<label className="drawer-overlay" htmlFor="sidebar-drawer" />
				<Sidebar />
			</div>
		</div>
	)
}
