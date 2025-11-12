import React, { useRef, useState } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'

const sample = `# Welcome

Type some **Markdown** here.

\`\`\`js
console.log('hello world')
\`\`\`

- bullet
- list

> blockquote
`

export default function App() {
	const [md, setMd] = useState(sample)
	const previewRef = useRef<HTMLDivElement | null>(null)

	return (
		<div className='app'>
			<header className='app-header'>
				<h1>Markdown Renderer — Vite SPA</h1>
			</header>

			<main className='container'>
				<Editor
					value={md}
					onChange={setMd}
					onLoadFile={(text) => setMd(text)}
				/>

				<Preview markdown={md} containerRef={previewRef} />
			</main>
		</div>
	)
}
