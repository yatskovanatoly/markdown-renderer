import { saveAs } from 'file-saver'
import 'highlight.js/styles/github-dark.css'
import { asBlob } from 'html-docx-js-typescript'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

export default function Preview({ markdown, containerRef }: Props) {
	const localRef = useRef<HTMLDivElement | null>(null)
	const exportRef = containerRef

	const getElement = () => exportRef?.current ?? localRef.current

	const exportPdf = async () => {
		const el = getElement()
		if (!el) return alert('Preview element not found')

		const canvas = await html2canvas(el, { scale: 2, useCORS: true })
		const imgData = canvas.toDataURL('image/png')

		const pdf = new jsPDF({
			orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
			unit: 'px',
			format: [canvas.width, canvas.height],
		})

		pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
		pdf.save('document.pdf')
	}

	const exportDocx = async () => {
		const el = getElement()
		if (!el) return alert('Preview not found')

		// Wrap the content in full HTML to preserve styling
		const content = `
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: Arial, sans-serif; color: #222; }
          h1, h2, h3 { color: #333; }
          pre, code {
            background: #f4f4f4;
            padding: 0.25em 0.5em;
            border-radius: 4px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>${el.innerHTML}</body>
    </html>
  `

		const blob = await asBlob(content).then((data) => data)
		if (blob instanceof Blob) saveAs(blob, 'document.docx')
	}

	return (
		<section className='preview-area'>
			<div className='preview-controls'>
				<button className='btn' onClick={exportPdf}>
					Export PDF
				</button>
				<button className='btn' onClick={exportDocx}>
					Export Word (.docx)
				</button>
			</div>

			<div
				className='preview'
				ref={(node) => {
					localRef.current = node
				}}
				id='preview-root'
			>
				<ReactMarkdown
					children={markdown}
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeHighlight]}
				/>
			</div>
		</section>
	)
}

type Props = {
	markdown: string
	containerRef: React.RefObject<HTMLDivElement>
}
