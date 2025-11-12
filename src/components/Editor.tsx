import React, { useRef } from 'react'

type Props = {
	value: string
	onChange: (v: string) => void
	onLoadFile: (text: string) => void
}

export default function Editor({ value, onChange, onLoadFile }: Props) {
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const onFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		if (!f) return
		const txt = await f.text()
		onLoadFile(txt)
		e.currentTarget.value = ''
	}

	return (
		<section className='editor'>
			<div className='editor-actions'>
				<label className='btn'>
					Load .md
					<input
						ref={fileInputRef}
						type='file'
						accept='.md,text/markdown,text/plain'
						style={{ display: 'none' }}
						onChange={onFilePick}
					/>
				</label>
			</div>
			<textarea
				className='md-input'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				spellCheck={false}
			/>
		</section>
	)
}
