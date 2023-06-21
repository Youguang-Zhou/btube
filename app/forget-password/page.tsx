'use client'

import { fetcher, poster } from '@/app/api/_index'
import SendEmailButton from '@/components/SendEmailButton'
import { ConfirmedPassword } from '@/components/textfields/ConfirmedPassword'
import { Email } from '@/components/textfields/Email'
import { Password } from '@/components/textfields/Password'
import { VerificationCode } from '@/components/textfields/VerificationCode'
import { encodeURLSearchParams } from '@/utils/functions'
import type { ResponseProps } from '@/utils/types'
import Link from 'next/link'
import { useContext, useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { AlertContext } from '../_providers'

const ForgetPasswordPage = () => {
	const { control, handleSubmit, getValues, trigger } = useForm({
		defaultValues: {
			user_password: '',
			user_confirmed_password: '',
			user_email: '',
			user_email_verification_code: '',
		} as FieldValues,
	})

	const [currStep, setCurrStep] = useState(1)
	const { setAlert } = useContext(AlertContext)

	const onSubmit = async (data: FieldValues) => {
		try {
			if (currStep === 1) {
				/**
				 * 第一步：检查该邮件地址是否存在
				 */
				const getRes = (await fetcher(
					`email?${encodeURLSearchParams({ email: getValues('user_email') })}`
				)) as ResponseProps<{ isExisted: boolean }>
				if (getRes.success && getRes.data) {
					if (getRes.data.isExisted) {
						// 当该邮件地址存在时进入下一步
						setCurrStep(2)
					} else {
						throw Error('该邮箱地址未被注册')
					}
				} else {
					throw Error(getRes.message)
				}
			} else if (currStep === 2) {
				/**
				 * 第二步：发送重置密码请求
				 */
				const postRes = await poster('reset-password', { ...data })
				if (postRes.success) {
					// 修改成功
					setCurrStep(3)
				} else {
					throw Error(postRes.message)
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				setAlert({ severity: 'error', message: error.message })
			}
		}
	}

	return (
		<div className="flex flex-col w-full h-full lg:w-1/2 lg:h-[80vh] px-5 mx-0 lg:px-0 lg:mx-auto gap-4">
			<div className="py-10 text-3xl font-bold text-center lg:py-20 text-black/80">
				{currStep === 3 ? (
					<div className="space-y-4">
						<div>大功告成！</div>
						<div>你的新密码已经可以使用</div>
					</div>
				) : (
					<div>让我们帮助你重新设置你的密码</div>
				)}
			</div>
			<ul className="w-full steps steps-horizontal">
				<li data-content={currStep > 1 ? '✓' : '1'} className={`step ${currStep >= 1 ? 'step-neutral' : ''}`} />
				<li data-content={currStep > 2 ? '✓' : '2'} className={`step ${currStep >= 2 ? 'step-neutral' : ''}`} />
				<li
					data-content={currStep === 3 ? '✓' : '3'}
					className={`step ${currStep === 3 ? 'step-neutral' : ''}`}
				/>
			</ul>
			<div className="w-full mx-auto mt-4 lg:mt-12 lg:w-1/2">
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
					{/* 密码 */}
					{currStep === 2 && (
						<Password
							name="user_password"
							control={control}
							label="新密码"
							placeholder="密码长度为8~30位字符，请注意大小写"
						/>
					)}
					{/* 确认密码 */}
					{currStep === 2 && (
						<ConfirmedPassword
							name="user_confirmed_password"
							control={control}
							onValidateEqual={(value) => value === getValues('user_password')}
						/>
					)}
					{/* 邮箱及发送验证码按钮 */}
					<div className="flex gap-4">
						{currStep !== 3 && (
							<Email className="flex-1" name="user_email" control={control} disabled={currStep === 2} />
						)}
						{currStep === 2 && (
							<SendEmailButton
								triggerValidation={() =>
									trigger(['user_password', 'user_confirmed_password', 'user_email'])
								}
								getEmail={() => getValues('user_email')}
								onSuccess={() => setAlert({ severity: 'success', message: '邮件发送成功' })}
								onError={(error) => setAlert({ severity: 'error', message: error.message })}
							/>
						)}
					</div>
					{/* 邮箱验证码 */}
					{currStep === 2 && <VerificationCode name="user_email_verification_code" control={control} />}
					{/* 表格提交按钮 */}
					{currStep !== 3 && (
						<button className="my-4 btn btn-block btn-neutral">{currStep === 1 ? '下一步' : '提交'}</button>
					)}
				</form>
				{currStep === 3 && (
					<Link className="my-12 btn btn-neutral btn-block" href="/">
						返回首页
					</Link>
				)}
			</div>
		</div>
	)
}

export default ForgetPasswordPage
