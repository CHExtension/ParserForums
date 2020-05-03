alert("Click anywhere on the page to test playing audio from an extension.")

document.addEventListener('click', () => {
	let url = chrome.runtime.getURL('note.mp3')
	console.log(url)

	let a = new Audio(url)
	a.play()
})
