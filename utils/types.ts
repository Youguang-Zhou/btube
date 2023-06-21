declare global {
	interface Window {
		LoginModal: HTMLDialogElement
	}
}

declare module 'next-auth' {
	interface Session {
		user: {
			id: number
			name: string
			image: string
		}
	}
}

export declare type ChannelType = 'user-channels' | 'public-channels'

interface _Video {
	video_id: number
	video_title: string
	video_cover: string
	video_iframe_url: string
	video_description: string
	duration: number
	creation_time: number
	channel_id: number
	collection_id: number
	author_name: string // 暂时的，将来用 user_id 代替
}

export declare interface ResponseProps<T> {
	success: boolean
	message: string
	data?: T
}

export declare interface CollectionProps {
	collection_id: number
	collection_title: string
	collection_cover: string
	collection_videos: _Video[]
	collection_duration: number
	collection_description?: string
}

export declare interface VideoProps {
	video_info: _Video
	video_collection?: CollectionProps
}

export declare interface SanLianProps {
	likes: number
}

export declare interface VideoDetailProps extends VideoProps {
	author_info: {
		author_id: number
		author_name: string
		author_avatar: string
	}
}

export declare interface GetVideosResponseProps {
	videos: VideoProps[]
	total_counts: number
}

export declare interface ChannelProps {
	channel_id: number
	channel_name: string
	channel_route: string
	channel_image: string
	channel_date: number
	channel_description?: string
	is_user_channel: boolean
}

export declare interface NoteProps {
	note_id: number
	note_name: string
	note_link: string
	channel_id: number
}

export declare interface ChannelDetailProps extends ChannelProps {
	channel_notes: NoteProps[] // UserChannel默认为[]
}

export declare interface UserProps {
	user_id: number
	user_name: string
	user_email: string
	user_avatar: string
}
