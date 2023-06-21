import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Input = styled(TextField)({
	'& label.Mui-focused': {
		color: '#303030',
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: '#303030',
	},
})
