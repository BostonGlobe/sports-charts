const $ = (selector) => document.querySelector(selector)

const removeClass = (el, className) =>
	el.classList.remove(className)

const addClass = (el, className) =>
	el.classList.add(className)

const hasClass = (el, className) =>
	el.classList.contains(className)

export {
	$,
	removeClass,
	addClass,
	hasClass,
}
