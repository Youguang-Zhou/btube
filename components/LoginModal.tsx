'use client'

import { AlertContext } from '@/app/_providers'
import { poster } from '@/app/api/_index'
import type { ResponseProps, UserProps } from '@/utils/types'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useContext, useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import SendEmailButton from './SendEmailButton'
import { ConfirmedPassword } from './textfields/ConfirmedPassword'
import { Email } from './textfields/Email'
import { Password } from './textfields/Password'
import { Username } from './textfields/Username'
import { VerificationCode } from './textfields/VerificationCode'

const LoginModal = () => {
	const {
		control,
		formState: { isSubmitting },
		handleSubmit,
		getValues,
		trigger,
		reset,
	} = useForm({
		defaultValues: {
			user_name: '',
			user_password: '',
			user_confirmed_password: '',
			user_email: '',
			user_email_verification_code: '',
		} as FieldValues,
	})

	// 是否展示全部注册页面
	const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false)
	// 展示反馈
	const { Alerter, setAlert } = useContext(AlertContext)

	// 最终点击注册/登录按钮时
	const onSubmit = async (data: FieldValues) => {
		try {
			if (showRegisterForm === false) {
				/**
				 * 登录
				 */
				const res = await signIn('credentials', { ...data, redirect: false })
				if (res && res.error === null) {
					// 登录成功
					setAlert({ severity: 'success', message: '登录成功' })
					window.LoginModal.close()
				} else {
					// 登录失败
					if (res?.error === 'UnregisteredError') {
						// 该用户名未注册
						setShowRegisterForm(true)
					} else {
						// 例如：密码错误
						throw Error(res?.error)
					}
				}
			} else {
				/**
				 * 注册
				 */
				// 发送注册请求
				const registerRes = (await poster('register', { ...data })) as ResponseProps<UserProps>
				if (registerRes.success && registerRes.data) {
					// 注册成功
					setAlert({ severity: 'success', message: '注册成功' })
					// 发送登录请求，由于Tablestore存数据有延迟，所以这里要不断请求登录（好不优雅
					let signInRes = await signIn('credentials', { ...data, redirect: false })
					const time = Date.now()
					const timeout = 15
					// 不断请求，直至成功或者15秒之后用户需手动登录
					while (signInRes?.error) {
						signInRes = await signIn('credentials', { ...data, redirect: false })
						if (
							(signInRes && signInRes.error === null) ||
							new Date(Date.now() - time).getSeconds() > timeout
						) {
							break
						}
					}
				} else {
					throw Error(registerRes.message)
				}
				window.LoginModal.close()
			}
		} catch (error) {
			if (error instanceof Error) {
				setAlert({ severity: 'error', message: error.message })
			}
		}
	}

	// 关闭当前模块
	const handleModalClose = () => {
		// 恢复登录页面
		setShowRegisterForm(false)
		// 重置表格内容
		reset()
	}

	return (
		<dialog id="LoginModal" className="modal modal-bottom lg:modal-middle" onClose={handleModalClose}>
			<form method="dialog" className="relative modal-box" onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className="mb-8 text-3xl font-bold select-none">
					<span className="block">花径不曾缘客扫，</span>
					<span className="block">蓬门今始为君开。</span>
				</div>
				<div className="flex flex-col gap-4">
					{/* 用户名 */}
					<Username
						name="user_name"
						control={control}
						helperText={showRegisterForm ? '这将是你登录的唯一方式，注册后可随时修改' : undefined}
					/>
					{/* 密码 */}
					<div className="relative inline-grid">
						<Password
							name="user_password"
							control={control}
							helperText={showRegisterForm ? '为了安全起见，请不要使用你在其他平台相同的密码' : undefined}
						/>
						<Link
							className={`
								${showRegisterForm ? 'hidden' : 'block'}
								absolute top-6 right-0 text-sm text-primary
							`}
							href="/forget-password"
							target="_blank"
							rel="noopener noreferrer"
						>
							忘记密码？
						</Link>
					</div>
					{showRegisterForm && (
						<>
							<div className="mb-0 text-xs divider">您还需以下信息以完成注册</div>
							{/* 确认密码 */}
							<ConfirmedPassword
								name="user_confirmed_password"
								control={control}
								onValidateEqual={(value) => value === getValues('user_password')}
							/>
							{/* 邮箱及发送验证码按钮 */}
							<div className="flex gap-4">
								<Email className="flex-1" name="user_email" control={control} />
								<SendEmailButton
									triggerValidation={() =>
										trigger(['user_name', 'user_password', 'user_confirmed_password', 'user_email'])
									}
									getEmail={() => getValues('user_email')}
									onSuccess={() => setAlert({ severity: 'success', message: '邮件发送成功' })}
									onError={(error) => setAlert({ severity: 'error', message: error.message })}
								/>
							</div>
							{/* 邮箱验证码 */}
							<VerificationCode name="user_email_verification_code" control={control} />
						</>
					)}
					<button
						className="relative btn !border-[#303030] font-normal mt-4 space-x-4"
						style={{
							background: showRegisterForm
								? 'white'
								: 'linear-gradient(100deg, white 0%, white 50%, #303030 50%, #303030 100%)',
						}}
						disabled={isSubmitting}
					>
						{showRegisterForm ? (
							<span className="text-[#303030]">注册</span>
						) : (
							<>
								<span className="text-[#303030]">注册</span>
								<span className="text-white">登录</span>
							</>
						)}
						{isSubmitting && (
							<span
								className={`
									loading loading-spinner loading-xs
									absolute bottom-1 right-1
									${showRegisterForm ? 'text-[#303030]' : 'text-white'}
								`}
							/>
						)}
					</button>
				</div>
				<button
					className="absolute border-none btn btn-sm btn-circle btn-outline right-3 top-3"
					onClick={(e) => {
						e.preventDefault()
						window.LoginModal.close()
					}}
				>
					<XMarkIcon className="w-5 h-5" />
				</button>
			</form>
			{Alerter}
		</dialog>
	)
}

export default LoginModal
