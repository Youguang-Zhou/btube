import type { FieldError, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Input } from './Input'

interface PasswordProps extends UseControllerProps {
	label?: string
	placeholder?: string
	helperText?: string
}

export const Password = ({ name, control, label, placeholder, helperText }: PasswordProps) => {
	const {
		field,
		formState: { errors },
	} = useController({
		name: name,
		control: control,
		defaultValue: '',
		rules: {
			required: '密码不能为空',
			minLength: {
				value: 8,
				message: '密码长度至少为8位字符',
			},
			maxLength: {
				value: 30,
				message: '密码长度最多为30位字符',
			},
		},
	})

	return (
		<Input
			label={label || '密码'}
			type="password"
			variant="standard"
			autoComplete="off"
			placeholder={placeholder}
			helperText={(errors?.[name] as FieldError | undefined)?.message || helperText}
			error={
				(errors?.[name] as FieldError | undefined)?.type === 'required' ||
				(errors?.[name] as FieldError | undefined)?.type === 'minLength' ||
				(errors?.[name] as FieldError | undefined)?.type === 'maxLength'
			}
			{...field}
			onChange={(e) => field.onChange(e.target.value.trim())}
		/>
	)
}
