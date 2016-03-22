import 'promis'
import FontFaceObserver from 'fontfaceobserver'

function createStylesheet() {
	const style = document.createElement('style')
	document.head.appendChild(style)
	return style.sheet
}

function addFontRule(sheet, font) {
	const rule = `
		.${font.family.toLowerCase()}-${font.suffix} {
			font-family: '${font.family}';
			font-weight: ${font.weight};
		}
	`.trim()
	sheet.insertRule(rule, 0)
}

export default function (args) {
	const sheet = createStylesheet()
	const handleError = err => console.err(err)

	args.forEach(font => {
		const fontObserver = new FontFaceObserver(`${font.family}`, { weight: font.weight })
		fontObserver.check().then(() => addFontRule(sheet, font)).catch(handleError)
	})
}
