const galleryImages = [
	"Images/IMG_4032.png",
	"Images/IMG_4081.png",
	"Images/IMG_4084.png",
	"Images/IMG_4090.png",
];

const shortcutConfig = {
	key: "h",
	requireAlt: false,
	requireShift: false,
	requireCtrlOrMeta: true,
};

function isTypingInField() {
	const active = document.activeElement;
	if (!active) return false;
	const tag = active.tagName;
	return (
		tag === "INPUT" || tag === "TEXTAREA" || active.isContentEditable === true
	);
}

function matchesShortcut(e) {
	if (e.key.toLowerCase() !== shortcutConfig.key) return false;
	if (shortcutConfig.requireAlt && !e.altKey) return false;
	if (shortcutConfig.requireShift && !e.shiftKey) return false;
	if (shortcutConfig.requireCtrlOrMeta && !(e.ctrlKey || e.metaKey))
		return false;
	return true;
}

function initHiddenGallery() {
	const container = document.getElementById("hiddenGallery");
	const imageEl = document.getElementById("hiddenGalleryImage");

	if (!container || !imageEl || galleryImages.length === 0) return;

	let isActive = false;
	let currentIndex = 0;

	function showImage() {
		imageEl.src = galleryImages[currentIndex];
		container.classList.add("is-visible");
		container.setAttribute("aria-hidden", "false");
	}

	function hideGallery() {
		isActive = false;
		currentIndex = 0;
		container.classList.remove("is-visible");
		container.setAttribute("aria-hidden", "true");
		imageEl.removeAttribute("src");
	}

	function advanceGallery() {
		if (!isActive) {
			isActive = true;
			currentIndex = 0;
			showImage();
			return;
		}

		if (currentIndex < galleryImages.length - 1) {
			currentIndex += 1;
			showImage();
		} else {
			hideGallery();
		}
	}

	document.addEventListener("keydown", (e) => {
		if (e.repeat) return;
		if (!matchesShortcut(e)) return;
		if (state.textEditMode && !isActive) return;
		if (isTypingInField() && !isActive) return;

		e.preventDefault();
		advanceGallery();
	});
}
