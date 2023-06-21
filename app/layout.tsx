import LoginModal from '@/components/LoginModal'
import { Metadata } from 'next'
import type { ReactNode } from 'react'
import { DrawerWrap, Footer, Header } from './_components'
import { AlertProvider, NextAuthProvider, SubscriptionProvider } from './_providers'
import './globals.css'

export const metadata: Metadata = {
	title: {
		default: 'BiliTube~UPUP! (=^ェ^=)',
		template: '%s | BiliTube~UPUP! (=^ェ^=)',
	},
	icons: {
		icon: '/favicon.ico',
	},
	appleWebApp: {
		title: 'BiliTube',
	},
}

const RootLayout = ({ children }: { children: ReactNode }) => (
	<html lang="en">
		<body>
			<NextAuthProvider>
				<SubscriptionProvider>
					<AlertProvider>
						<Header />
						<DrawerWrap>{children}</DrawerWrap>
						<Footer />
						<LoginModal />
					</AlertProvider>
				</SubscriptionProvider>
			</NextAuthProvider>
		</body>
	</html>
)

export default RootLayout
