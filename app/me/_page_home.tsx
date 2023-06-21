import Avatar from '@/components/Avatar'
import { UsernameRules } from '@/components/textfields/Username'
import { PencilSquareIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useContext, useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { AlertContext } from '../_providers'
import { authPutter } from '../api/_index'
import type { AvatarPorps } from './_components'
import { ChangeAvatar } from './_components'

interface FormInputProps {
	user_name: string
}

const HomePage = () => {
	const { data: session, update } = useSession()
	const {
		register,
		formState: { errors, isSubmitting },
		handleSubmit,
		reset,
		setError,
	} = useForm<FormInputProps>({
		defaultValues: {
			user_name: session?.user.name || '',
		},
	})

	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [isChangingAvatar, setIsChangingAvatar] = useState<boolean>(false)
	const [avatar, setAvatar] = useState<AvatarPorps | undefined>(undefined)
	const { setAlert } = useContext(AlertContext)

	useEffect(() => {
		if (isChangingAvatar === false) {
			setAvatar(undefined)
		}
	}, [isChangingAvatar])

	const onSubmit: SubmitHandler<FormInputProps> = async (data) => {
		try {
			if (data.user_name === session?.user.name) {
				setIsEditing(false)
				return
			}
			const res = await authPutter('user', { user_name: data.user_name })
			if (res.success) {
				// 更新session
				update({ name: data.user_name })
				// 反馈结果
				setAlert({ severity: 'success', message: '修改成功' })
				// 退出编辑模式
				setIsEditing(false)
			} else {
				throw Error(res.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				setError('user_name', { type: 'server', message: error.message })
			}
		}
	}

	const handleSaveAvatarBtnClicked = async () => {
		try {
			if (avatar === undefined) {
				setIsChangingAvatar(false)
				return
			}
			const res = await authPutter('user', { user_avatar: avatar.avatar_name })
			if (res.success && avatar) {
				// 更新session
				update({ picture: avatar.avatar_url })
				// 反馈结果
				setAlert({ severity: 'success', message: '修改成功' })
				// 退出修改模式
				setIsChangingAvatar(false)
			} else {
				throw Error(res.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				setAlert({ severity: 'error', message: error.message })
			}
		}
	}

	return (
		<div
			className={`
					flex justify-center gap-2 lg:flex-row lg:justify-around lg:gap-0
					${isChangingAvatar ? 'flex-col' : 'flex-col-reverse'}
				`}
		>
			{/* 用户名 */}
			<form
				className={`
						${isChangingAvatar ? 'w-0' : 'w-full lg:w-1/2 px-4 lg:px-0'}
						transition-all
					`}
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<div className={isChangingAvatar ? 'hidden' : 'block'}>
					<label className="label">
						<span className="text-lg font-bold">用户名</span>
						{isEditing === false && (
							<PencilSquareIcon
								className="w-5 h-5 hover:cursor-pointer"
								onClick={() => setIsEditing(true)}
							/>
						)}
					</label>
					<input
						className={`
								w-full input input-sm input-bordered disabled:cursor-default
								${errors.user_name ? 'input-error' : 'focus:border-primary focus:outline-primary'}
							`}
						{...register('user_name', { ...UsernameRules })}
						readOnly={isEditing === false}
						disabled={isEditing === false}
					/>
					{errors.user_name && <p className="mt-2 ml-2 text-xs text-red-500">{errors.user_name.message}</p>}
				</div>
				{isEditing && (
					<div className="flex gap-2 mt-4 lg:mt-8">
						<button
							type="button"
							className="flex-1 btn btn-sm btn-outline hover:text-black hover:bg-white"
							onClick={() => {
								reset({
									user_name: session?.user.name || '',
								})
								setIsEditing(false)
							}}
						>
							取消
						</button>
						<button type="submit" className="flex-1 btn btn-sm btn-neutral" disabled={isSubmitting}>
							保存
						</button>
					</div>
				)}
			</form>
			{/* 头像 */}
			<div className="relative flex flex-col items-center gap-2">
				<Avatar className="w-40 h-40" src={avatar?.avatar_url} />
				{isEditing === false && (
					<>
						{isChangingAvatar === false ? (
							<button
								className="absolute bg-white border-2 right-20 lg:right-0 bottom-2 btn btn-circle"
								onClick={() => setIsChangingAvatar(true)}
							>
								<PhotoIcon className="w-6 h-6 text-gray-500" />
							</button>
						) : (
							<>
								<button
									className="mt-2 btn btn-block btn-xs btn-neutral"
									onClick={handleSaveAvatarBtnClicked}
								>
									保存
								</button>
								<button className="btn btn-block btn-xs" onClick={() => setIsChangingAvatar(false)}>
									返回
								</button>
							</>
						)}
					</>
				)}
			</div>
			{isChangingAvatar && (
				<div className="w-full mt-6 lg:w-2/3 lg:mt-0">
					<ChangeAvatar onAvatarClicked={(avatar) => setAvatar(avatar)} />
				</div>
			)}
		</div>
	)
}

export default HomePage
