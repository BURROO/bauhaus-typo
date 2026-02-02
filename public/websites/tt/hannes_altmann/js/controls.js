/**
 * UI Controls and event listeners
 * Manages all sliders, buttons, radio controls, and wheel input
 */

function initControls() {
	// Function to update visible force type options based on current mode
	function updateForceTypeVisibility() {
		const forceTypeLabel = document.querySelector(
			"label:has(+ .force-type-grid)",
		);
		const forceOptions = document.querySelectorAll("span[data-force-modes]");

		if (state.selectionMode) {
			// Hide all force options in selection mode
			if (forceTypeLabel) forceTypeLabel.style.display = "none";
			forceOptions.forEach((option) => (option.style.display = "none"));
		} else {
			// Show force type label
			if (forceTypeLabel) forceTypeLabel.style.display = "block";

			// Show/hide options based on shape mode
			forceOptions.forEach((option) => {
				const modes = option.getAttribute("data-force-modes");
				if (modes && modes.includes(state.shapeMode)) {
					option.style.display = "block";
				} else {
					option.style.display = "none";
				}
			});
		}
	}

	// --- Font Size Slider ---
	if (state.el.sliderFont) {
		state.el.sliderFont.addEventListener("input", renderText);
	}

	// --- Force Strength Slider ---
	if (state.el.sliderForce) {
		const initial = parseFloat(state.el.sliderForce.value);
		if (!isNaN(initial)) {
			state.forceStrength = initial;
		}
		state.el.sliderForce.addEventListener("input", (event) => {
			const v = parseFloat(event.target.value);
			if (!isNaN(v)) {
				state.forceStrength = v;
			}
		});
	}

	// --- Mouse Radius Slider ---
	if (state.el.sliderRadius) {
		const initial = parseFloat(state.el.sliderRadius.value);
		if (!isNaN(initial)) {
			state.mouseRadius = initial;
			state.mouseRadiusCircle.radius = state.mouseRadius;
		}
		state.el.sliderRadius.addEventListener("input", (event) => {
			const v = parseFloat(event.target.value);
			if (!isNaN(v)) {
				// scale existing circle instead of recreating it
				const currentRadius = state.mouseRadiusCircle?.bounds
					? state.mouseRadiusCircle.bounds.width / 2
					: state.mouseRadius || 1;
				const factor = currentRadius > 0 ? v / currentRadius : 1;
				state.mouseRadius = v;
				if (
					state.mouseRadiusCircle &&
					typeof state.mouseRadiusCircle.scale === "function"
				) {
					// scale around the item's center (default)
					state.mouseRadiusCircle.scale(factor);
					// restore stroke/dash to constant visual size
					state.mouseRadiusCircle.strokeWidth = 1;
					state.mouseRadiusCircle.dashArray = [4, 4];
					// ensure it's present and visible
					paper.project.activeLayer.addChild(state.mouseRadiusCircle);
					state.mouseRadiusCircle.bringToFront();
				}
				// also scale square
				if (
					state.mouseRadiusSquare &&
					typeof state.mouseRadiusSquare.scale === "function"
				) {
					state.mouseRadiusSquare.scale(factor);
					state.mouseRadiusSquare.strokeWidth = 1;
					state.mouseRadiusSquare.dashArray = [4, 4];
				}
			}
		});
	}

	// --- Wheel / trackpad support: adjust mouseRadius with scroll gestures ---
	const minRadius = parseFloat(state.el.sliderRadius?.min || 10);
	const maxRadius = parseFloat(state.el.sliderRadius?.max || 200);
	const wheelStep = 3; // change per wheel "tick"

	if (state.el.canvas) {
		state.el.canvas.addEventListener(
			"wheel",
			(event) => {
				// Prevent the page from scrolling when adjusting radius
				event.preventDefault();

				// On most devices: deltaY < 0 => scroll up (increase), deltaY > 0 => scroll down (decrease)
				const delta = event.deltaY < 0 ? wheelStep : -wheelStep;
				let newRadius = Math.round(
					Math.max(minRadius, Math.min(maxRadius, state.mouseRadius + delta)),
				);

				if (newRadius !== state.mouseRadius) {
					const currentRadius = state.mouseRadiusCircle?.bounds
						? state.mouseRadiusCircle.bounds.width / 2
						: state.mouseRadius || 1;
					const factor = currentRadius > 0 ? newRadius / currentRadius : 1;
					state.mouseRadius = newRadius;

					if (
						state.mouseRadiusCircle &&
						typeof state.mouseRadiusCircle.scale === "function"
					) {
						state.mouseRadiusCircle.scale(factor);
						state.mouseRadiusCircle.strokeWidth = 1;
						state.mouseRadiusCircle.dashArray = [4, 4];
						paper.project.activeLayer.addChild(state.mouseRadiusCircle);
						state.mouseRadiusCircle.bringToFront();
					}

					if (
						state.mouseRadiusSquare &&
						typeof state.mouseRadiusSquare.scale === "function"
					) {
						state.mouseRadiusSquare.scale(factor);
						state.mouseRadiusSquare.strokeWidth = 1;
						state.mouseRadiusSquare.dashArray = [4, 4];
					}

					// keep the slider in sync if present
					if (state.el.sliderRadius)
						state.el.sliderRadius.value = state.mouseRadius;
				}
			},
			{ passive: false },
		);
	}

	// --- Line Height Slider ---
	const sliderLineHeight = document.getElementById("SliderLineHeight");
	if (sliderLineHeight) {
		const initial = parseFloat(sliderLineHeight.value);
		if (!isNaN(initial)) state.lineHeightFactor = initial;
		sliderLineHeight.addEventListener("input", (e) => {
			const v = parseFloat(e.target.value);
			if (!isNaN(v)) {
				state.lineHeightFactor = v;
				renderText();
			}
		});
	}

	// --- Tracking Slider ---
	const sliderTracking = document.getElementById("SliderTracking");
	if (sliderTracking) {
		const initialEm = parseFloat(sliderTracking.value);
		if (!isNaN(initialEm)) state.trackingEm = initialEm;
		sliderTracking.addEventListener("input", (e) => {
			const v = parseFloat(e.target.value);
			if (!isNaN(v)) {
				state.trackingEm = v;
				renderText();
			}
		});
	}

	// ---   and Render Buttons ---
	if (state.el.Btn) {
		state.el.Btn.addEventListener("click", () =>
			SVG(paper, state.textField, state.handle, state.mouseRadiusCircle),
		);
	}

	if (state.el.renderBtn) {
		state.el.renderBtn.addEventListener("click", renderText);
	}

	// --- Fill Text Button ---
	const fillTextBtn = document.getElementById("fillTextBtn");
	if (fillTextBtn) {
		fillTextBtn.addEventListener("click", () => {
			const placeholder = state.el.overlayTextarea.placeholder || "";
			if (!placeholder) return;

			// Repeat placeholder text to fill the textfield
			// Estimate: multiply by a large factor to ensure it fills completely
			const textfieldArea =
				state.textField.bounds.width * state.textField.bounds.height;
			const estimatedCharsPerArea =
				textfieldArea / (state.fontSize * state.fontSize);
			const repetitions = Math.ceil(estimatedCharsPerArea / placeholder.length);

			let filledText = "";
			for (let i = 0; i < repetitions; i++) {
				filledText += placeholder + " ";
			}

			state.currentText = filledText;
			state.el.overlayTextarea.value = filledText;
			renderText();
			console.log("Filled textfield with placeholder text");
		});
	}

	// --- Force Type Radio Buttons (push / pull / spin) ---
	const forceRadios = document.querySelectorAll('input[name="force"]');
	forceRadios.forEach((radio) => {
		radio.addEventListener("change", (e) => {
			state.forceType = e.target.value;
			console.log("Force type changed to:", state.forceType);
		});
	});

	// --- Mode Radio Buttons (selection, circle, square) ---
	const modeRadios = document.querySelectorAll('input[name="mode"]');
	modeRadios.forEach((radio) => {
		radio.addEventListener("change", (e) => {
			const modeId = e.target.id;

			if (modeId === "noSelectionMode") {
				// Selection (no-force) mode
				state.selectionMode = true;
				if (state.mouseRadiusCircle) state.mouseRadiusCircle.visible = false;
				if (state.mouseRadiusSquare) state.mouseRadiusSquare.visible = false;
				if (state.el.canvas) state.el.canvas.style.cursor = "default";
				updateForceTypeVisibility();
			} else if (modeId === "shapeCircle") {
				// Circle selection mode
				state.shapeMode = "circle";
				state.selectionMode = false;
				state.mouseRadiusCircle.visible = true;
				state.mouseRadiusSquare.visible = false;
				const posC = state.lastMousePoint || paper.view.center;
				if (state.mouseRadiusCircle) state.mouseRadiusCircle.position = posC;
				if (state.mouseRadiusSquare) state.mouseRadiusSquare.position = posC;
				if (state.el.canvas)
					state.el.canvas.style.cursor =
						"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><circle cx='6' cy='6' r='4' fill='white'/></svg>\") 6 6, auto";
				updateForceTypeVisibility();
			} else if (modeId === "shapeSquare") {
				// Square selection mode
				state.shapeMode = "square";
				state.selectionMode = false;
				state.mouseRadiusCircle.visible = false;
				state.mouseRadiusSquare.visible = true;
				const posS = state.lastMousePoint || paper.view.center;
				if (state.mouseRadiusCircle) state.mouseRadiusCircle.position = posS;
				if (state.mouseRadiusSquare) state.mouseRadiusSquare.position = posS;
				// Update cursor to show direction arrow
				updateSquareCursor();
				updateForceTypeVisibility();
			}
		});
	});

	// --- Keyboard Shortcuts for Shape Mode ---
	document.addEventListener("keydown", (e) => {
		// Ignore if typing in text edit mode
		if (state.textEditMode) return;

		const key = e.key.toLowerCase();

		if (key === "v") {
			// Enter selection (no-force) mode (single-use)
			if (!state.selectionMode) {
				state.selectionMode = true;
				// Hide both visuals and set cursor to default
				if (state.mouseRadiusCircle) state.mouseRadiusCircle.visible = false;
				if (state.mouseRadiusSquare) state.mouseRadiusSquare.visible = false;
				if (state.el.canvas) state.el.canvas.style.cursor = "default";
				// Update radio button UI
				const cursorRadio = document.getElementById("noSelectionMode");
				if (cursorRadio) cursorRadio.checked = true;
				updateForceTypeVisibility();
			}
			// Do nothing when already in selection mode; exit happens with 'c' or 's'
		} else if (key === "c") {
			// Always switch to circle and exit selection mode
			state.shapeMode = "circle";
			state.selectionMode = false;
			state.mouseRadiusCircle.visible = true;
			state.mouseRadiusSquare.visible = false;
			// Position visuals at last pointer so circle appears immediately
			const posC = state.lastMousePoint || paper.view.center;
			if (state.mouseRadiusCircle) state.mouseRadiusCircle.position = posC;
			if (state.mouseRadiusSquare) state.mouseRadiusSquare.position = posC;
			// Show small dot cursor when switching to circle mode
			if (state.el.canvas)
				state.el.canvas.style.cursor =
					"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><circle cx='6' cy='6' r='4' fill='white'/></svg>\") 6 6, auto";
			// Update radio button UI
			const circleRadio = document.getElementById("shapeCircle");
			if (circleRadio) circleRadio.checked = true;
			updateForceTypeVisibility();
			console.log("Shape changed to: circle");
		} else if (key === "s") {
			if (state.selectionMode || state.shapeMode !== "square") {
				// Switch to square mode (or just exit selection mode if already square)
				state.shapeMode = "square";
				state.selectionMode = false;
				state.mouseRadiusCircle.visible = false;
				state.mouseRadiusSquare.visible = true;
				// Position visuals at last pointer so square appears immediately
				const posS = state.lastMousePoint || paper.view.center;
				if (state.mouseRadiusCircle) state.mouseRadiusCircle.position = posS;
				if (state.mouseRadiusSquare) state.mouseRadiusSquare.position = posS;
				// Update cursor to show direction arrow
				updateSquareCursor();
				// Update radio button UI
				const squareRadio = document.getElementById("shapeSquare");
				if (squareRadio) squareRadio.checked = true;
				updateForceTypeVisibility();
				console.log("Shape changed to: square");
			} else {
				// Already in square mode and not in selection mode - cycle through force directions
				if (
					state.mouseRadiusSquare &&
					typeof state.mouseRadiusSquare.cycleForceDirection === "function"
				) {
					state.mouseRadiusSquare.cycleForceDirection();
				}
			}
		}
	});

	// Initialize force type visibility based on initial state
	updateForceTypeVisibility();

	// Set cursor for default circle mode on page load
	if (state.shapeMode === "circle" && state.el.canvas) {
		state.el.canvas.style.cursor =
			"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><circle cx='6' cy='6' r='4' fill='white'/></svg>\") 6 6, auto";
	}

	// Pause force calculations while the control panel is animating to improve animation smoothness
	const controlsPanel = document.getElementById("controls");
	const PANEL_ANIMATION_DURATION = 550; // matches CSS transition duration (0.55s)

	if (controlsPanel) {
		controlsPanel.addEventListener("mouseenter", () => {
			state.panelHovered = true;
		});
		controlsPanel.addEventListener("mouseleave", () => {
			// Keep force calculations paused until the panel finishes shrinking
			setTimeout(() => {
				state.panelHovered = false;
			}, PANEL_ANIMATION_DURATION);
		});
	}
}
