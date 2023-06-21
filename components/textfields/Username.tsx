import type { FieldError, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Input } from './Input'

interface UsernameProps extends UseControllerProps {
	helperText?: string
}

export const UsernameRules = {
	required: '用户名不能为空',
	maxLength: {
		value: 20,
		message: '用户名长度最多为20位字符',
	},
	pattern: {
		value: /^[\u4e00-\u9fa5\-_a-zA-Z0-9]+$/,
		message: '用户名只能包含中文、英文、数字及短横线和下划线',
	},
	validate: {
		noOfficial: (value: string) =>
			value.toLowerCase().includes('official') === false ||
			'我们不提倡用户名里包含official字样。如果你的官方名称被占用，请联系我们。',
		onlyOne: (value: string) =>
			((value.match(/-/g) || []).length <= 1 && (value.match(/_/g) || []).length <= 1) ||
			'短横线或下划线的个数最多为1',
	},
}

export const Username = ({ name, control, helperText }: UsernameProps) => {
	const {
		field,
		formState: { errors },
	} = useController({
		name: name,
		control: control,
		defaultValue: '',
		rules: UsernameRules,
	})

	return (
		<Input
			label="用户名"
			variant="standard"
			autoComplete="off"
			helperText={(errors?.[name] as FieldError | undefined)?.message || helperText}
			error={
				(errors?.[name] as FieldError | undefined)?.type === 'required' ||
				(errors?.[name] as FieldError | undefined)?.type === 'maxLength' ||
				(errors?.[name] as FieldError | undefined)?.type === 'pattern' ||
				(errors?.[name] as FieldError | undefined)?.type === 'noOfficial' ||
				(errors?.[name] as FieldError | undefined)?.type === 'onlyOne'
			}
			{...field}
			onChange={(e) => field.onChange(e.target.value.trim())}
		/>
	)
}
