/**
 * Force system for TypeForceOne
 * Encapsulates different force effects that can be applied to letters
 */

/**
 * Apply circle push-away force: letters are pushed away from the mouse
 * @param {Array} letters - Array of Paper.js PointText items
 * @param {Point} mousePos - Current mouse position
 * @param {Number} mouseRadius - Radius within which force is applied
 * @param {Number} forceStrength - Strength multiplier of the force
 */
function applyCirclePushForce(letters, mousePos, mouseRadius, forceStrength) {
	const radiusSquared = mouseRadius * mouseRadius;

	for (let l of letters) {
		// Cheap bounding box check FIRST (4 simple comparisons, no math)
		if (
			l.position.x < mousePos.x - mouseRadius ||
			l.position.x > mousePos.x + mouseRadius ||
			l.position.y < mousePos.y - mouseRadius ||
			l.position.y > mousePos.y + mouseRadius
		)
			continue;

		// Calculate squared distance (no sqrt!)
		const dx = l.position.x - mousePos.x;
		const dy = l.position.y - mousePos.y;
		const distSquared = dx * dx + dy * dy;

		if (distSquared < radiusSquared) {
			// Only NOW calculate actual distance (once, when we know we need it)
			const dist = Math.sqrt(distSquared);
			const force = (mouseRadius - dist) * forceStrength;
			const dir = l.position.subtract(mousePos).normalize();
			l.position = l.position.add(dir.multiply(force));
		}
	}
}

/**
 * Apply circle pull force: letters are pulled towards the mouse (opposite of push)
 * @param {Array} letters - Array of Paper.js PointText items
 * @param {Point} mousePos - Current mouse position
 * @param {Number} mouseRadius - Radius within which force is applied
 * @param {Number} forceStrength - Strength multiplier of the force
 */
function applyCirclePullForce(letters, mousePos, mouseRadius, forceStrength) {
	const radiusSquared = mouseRadius * mouseRadius;

	for (let l of letters) {
		// Cheap bounding box check FIRST (4 simple comparisons, no math)
		if (
			l.position.x < mousePos.x - mouseRadius ||
			l.position.x > mousePos.x + mouseRadius ||
			l.position.y < mousePos.y - mouseRadius ||
			l.position.y > mousePos.y + mouseRadius
		) {
			continue;
		}

		// Calculate squared distance (no sqrt!)
		const dx = l.position.x - mousePos.x;
		const dy = l.position.y - mousePos.y;
		const distSquared = dx * dx + dy * dy;

		if (distSquared < radiusSquared) {
			// Only NOW calculate actual distance (once, when we know we need it)
			const dist = Math.sqrt(distSquared);
			const force = (mouseRadius - dist) * forceStrength;
			const dir = mousePos.subtract(l.position).normalize(); // opposite direction
			l.position = l.position.add(dir.multiply(force));
		}
	}
}

/**
 * Apply square push force: acts like a solid wall, pushing letters in the direction of square movement
 * @param {Array} letters - Array of Paper.js PointText items
 * @param {Point} mousePos - Current mouse position
 * @param {Number} mouseRadius - Half-size of the square (square spans from -mouseRadius to +mouseRadius from center)
 * @param {Number} forceStrength - Strength multiplier of the force
 * @param {Point} movementDelta - Direction and magnitude of square movement
 */
function applySquarePushForce(
	letters,
	mousePos,
	mouseRadius,
	forceStrength,
	forceDirection = "right",
) {
	// mousePos is the center of the square; mouseRadius is the half-size (square spans ±mouseRadius)
	const dir = forceDirection || "right";
	const cx = mousePos.x;
	const cy = mousePos.y;
	const left = cx - mouseRadius;
	const right = cx + mouseRadius;
	const top = cy - mouseRadius;
	const bottom = cy + mouseRadius;
	const span = mouseRadius * 2; // full width/height

	for (let l of letters) {
		const px = l.position.x;
		const py = l.position.y;

		// Only affect letters inside the square bounds
		if (px < left || px > right || py < top || py > bottom) continue;

		const dx = px - cx;
		const dy = py - cy;

		let fx = 0;
		let fy = 0;

		// Falloff: weakest at the pushing edge (distance = 0), strongest at the opposite edge (distance = span).
		// Scale by a modest fraction of mouseRadius to keep visible effect without being overpowering
		const baseScale = mouseRadius * 0.5;

		// OPTION 1: Standard Push - Quadratic falloff from edge to edge
		if (dir === "right") {
			const distance = right - px; // 0 at right edge (pushing), span at left edge
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			if (strength > 0) fx = strength * baseScale * forceStrength; // push +x
		} else if (dir === "left") {
			const distance = px - left; // 0 at left edge (pushing), span at right edge
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			if (strength > 0) fx = -strength * baseScale * forceStrength; // push -x
		} else if (dir === "down") {
			const distance = bottom - py; // 0 at bottom edge (pushing), span at top edge
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			if (strength > 0) fy = strength * baseScale * forceStrength; // push +y
		} else if (dir === "up") {
			const distance = py - top; // 0 at top edge (pushing), span at bottom edge
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			if (strength > 0) fy = -strength * baseScale * forceStrength; // push -y
		}

		// OPTION 11: Split Push - top half goes up, bottom half goes down (bidirectional)
		// if (dir === 'right' || dir === 'left') {
		//     const distance = (dir === 'right') ? (right - px) : (px - left);
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = t * t;
		//     // Split vertically: above center = push up, below center = push down
		//     const verticalDist = Math.abs(py - cy);
		//     fy = (py > cy ? 1 : -1) * strength * baseScale * forceStrength;
		// } else if (dir === 'down' || dir === 'up') {
		//     const distance = (dir === 'down') ? (bottom - py) : (py - top);
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = t * t;
		//     // Split horizontally: right of center = push right, left of center = push left
		//     fx = (px > cx ? 1 : -1) * strength * baseScale * forceStrength;
		// }

		// OPTION 13: Spiral Push - rotates push direction around center (creates vortex)
		// if (dir === 'right' || dir === 'left') {
		//     const distance = (dir === 'right') ? (right - px) : (px - left);
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = t * t;
		//     // Tangential force (perpendicular to radius)
		//     const angle = Math.atan2(dy, dx);
		//     fx = -Math.sin(angle) * strength * baseScale * forceStrength;
		//     fy = Math.cos(angle) * strength * baseScale * forceStrength;
		// } else if (dir === 'down' || dir === 'up') {
		//     const distance = (dir === 'down') ? (bottom - py) : (py - top);
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = t * t;
		//     const angle = Math.atan2(dy, dx);
		//     fx = -Math.sin(angle) * strength * baseScale * forceStrength;
		//     fy = Math.cos(angle) * strength * baseScale * forceStrength;
		// }

		// OPTION 14: Random Jitter - random displacement scaled by distance (chaotic scatter)
		// if (dir === 'right') {
		//     const distance = right - px;
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = t * t;
		//     fx = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		//     fy = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		// } else if (dir === 'left') {
		//     const distance = px - left;
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = t * t;
		//     fx = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		//     fy = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		// } else if (dir === 'down') {
		//     const distance = bottom - py;
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = t * t;
		//     fx = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		//     fy = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		// } else if (dir === 'up') {
		//     const distance = py - top;
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = t * t;
		//     fx = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		//     fy = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		// }

		// OPTION 15: Peak at Center - strongest in middle, weak at both edges (bell curve)
		// if (dir === 'right') {
		//     const distance = right - px;
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = Math.sin(t * Math.PI); // bell curve peaking at t=0.5
		//     if (strength > 0) fx = strength * baseScale * forceStrength;
		// } else if (dir === 'left') {
		//     const distance = px - left;
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = Math.sin(t * Math.PI);
		//     if (strength > 0) fx = -strength * baseScale * forceStrength;
		// } else if (dir === 'down') {
		//     const distance = bottom - py;
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = Math.sin(t * Math.PI);
		//     if (strength > 0) fy = strength * baseScale * forceStrength;
		// } else if (dir === 'up') {
		//     const distance = py - top;
		//     const t = Math.max(0, Math.min(1, distance / span));
		//     const strength = Math.sin(t * Math.PI);
		//     if (strength > 0) fy = -strength * baseScale * forceStrength;
		// }

		if (fx !== 0 || fy !== 0) {
			l.position = l.position.add(new paper.Point(fx, fy));
		}
	}
}

/**
 * Apply square split force: placeholder for split behavior
 * @param {Array} letters - Array of Paper.js PointText items
 * @param {Point} mousePos - Current mouse position
 * @param {Number} mouseRadius - Half-size of the square
 * @param {Number} forceStrength - Strength multiplier of the force
 * @param {String} forceDirection - Direction of the square force
 */
function applySquareSplitForce(
	letters,
	mousePos,
	mouseRadius,
	forceStrength,
	forceDirection = "right",
) {
	// mousePos is the center of the square; mouseRadius is the half-size (square spans ±mouseRadius)
	const dir = forceDirection || "right";
	const cx = mousePos.x;
	const cy = mousePos.y;
	const left = cx - mouseRadius;
	const right = cx + mouseRadius;
	const top = cy - mouseRadius;
	const bottom = cy + mouseRadius;
	const span = mouseRadius * 2; // full width/height

	for (let l of letters) {
		const px = l.position.x;
		const py = l.position.y;

		// Only affect letters inside the square bounds
		if (px < left || px > right || py < top || py > bottom) continue;

		const dx = px - cx;
		const dy = py - cy;

		let fx = 0;
		let fy = 0;

		// Falloff: weakest at the pushing edge (distance = 0), strongest at the opposite edge (distance = span).
		// Scale by a modest fraction of mouseRadius to keep visible effect without being overpowering
		const baseScale = mouseRadius * 0.5;

		// OPTION 11: Split Push - top half goes up, bottom half goes down (bidirectional)
		if (dir === "right" || dir === "left") {
			const distance = dir === "right" ? right - px : px - left;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			// Split vertically: above center = push up, below center = push down
			const verticalDist = Math.abs(py - cy);
			fy = (py > cy ? 1 : -1) * strength * baseScale * forceStrength;
		} else if (dir === "down" || dir === "up") {
			const distance = dir === "down" ? bottom - py : py - top;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			// Split horizontally: right of center = push right, left of center = push left
			fx = (px > cx ? 1 : -1) * strength * baseScale * forceStrength;
		}

		if (fx !== 0 || fy !== 0) {
			l.position = l.position.add(new paper.Point(fx, fy));
		}
	}
}

/**
 * Apply square spiral force: placeholder for spiral behavior
 * @param {Array} letters - Array of Paper.js PointText items
 * @param {Point} mousePos - Current mouse position
 * @param {Number} mouseRadius - Half-size of the square
 * @param {Number} forceStrength - Strength multiplier of the force
 * @param {String} forceDirection - Direction of the square force
 */
function applySquareSpiralForce(
	letters,
	mousePos,
	mouseRadius,
	forceStrength,
	forceDirection = "right",
) {
	// mousePos is the center of the square; mouseRadius is the half-size (square spans ±mouseRadius)
	const dir = forceDirection || "right";
	const cx = mousePos.x;
	const cy = mousePos.y;
	const left = cx - mouseRadius;
	const right = cx + mouseRadius;
	const top = cy - mouseRadius;
	const bottom = cy + mouseRadius;
	const span = mouseRadius * 2; // full width/height

	for (let l of letters) {
		const px = l.position.x;
		const py = l.position.y;

		// Only affect letters inside the square bounds
		if (px < left || px > right || py < top || py > bottom) continue;

		const dx = px - cx;
		const dy = py - cy;

		let fx = 0;
		let fy = 0;

		// Falloff: weakest at the pushing edge (distance = 0), strongest at the opposite edge (distance = span).
		// Scale by a modest fraction of mouseRadius to keep visible effect without being overpowering
		const baseScale = mouseRadius * 0.5;

		// OPTION 13: Spiral Push - rotates push direction around center (creates vortex)
		if (dir === "right" || dir === "left") {
			const distance = dir === "right" ? right - px : px - left;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			// Tangential force (perpendicular to radius)
			const angle = Math.atan2(dy, dx);
			fx = -Math.sin(angle) * strength * baseScale * forceStrength;
			fy = Math.cos(angle) * strength * baseScale * forceStrength;
		} else if (dir === "down" || dir === "up") {
			const distance = dir === "down" ? bottom - py : py - top;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			const angle = Math.atan2(dy, dx);
			fx = -Math.sin(angle) * strength * baseScale * forceStrength;
			fy = Math.cos(angle) * strength * baseScale * forceStrength;
		}

		if (fx !== 0 || fy !== 0) {
			l.position = l.position.add(new paper.Point(fx, fy));
		}
	}
}

/**
 * Apply square jitter force: placeholder for jitter behavior
 * @param {Array} letters - Array of Paper.js PointText items
 * @param {Point} mousePos - Current mouse position
 * @param {Number} mouseRadius - Half-size of the square
 * @param {Number} forceStrength - Strength multiplier of the force
 * @param {String} forceDirection - Direction of the square force
 */
function applySquareJitterForce(
	letters,
	mousePos,
	mouseRadius,
	forceStrength,
	forceDirection = "right",
) {
	// mousePos is the center of the square; mouseRadius is the half-size (square spans ±mouseRadius)
	const dir = forceDirection || "right";
	const cx = mousePos.x;
	const cy = mousePos.y;
	const left = cx - mouseRadius;
	const right = cx + mouseRadius;
	const top = cy - mouseRadius;
	const bottom = cy + mouseRadius;
	const span = mouseRadius * 2; // full width/height

	for (let l of letters) {
		const px = l.position.x;
		const py = l.position.y;

		// Only affect letters inside the square bounds
		if (px < left || px > right || py < top || py > bottom) continue;

		const dx = px - cx;
		const dy = py - cy;

		let fx = 0;
		let fy = 0;

		// Falloff: weakest at the pushing edge (distance = 0), strongest at the opposite edge (distance = span).
		// Scale by a modest fraction of mouseRadius to keep visible effect without being overpowering
		const baseScale = mouseRadius * 0.5;

		// OPTION 14: Random Jitter - random displacement scaled by distance (chaotic scatter)
		if (dir === "right") {
			const distance = right - px;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			fx = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
			fy = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		} else if (dir === "left") {
			const distance = px - left;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			fx = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
			fy = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		} else if (dir === "down") {
			const distance = bottom - py;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			fx = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
			fy = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		} else if (dir === "up") {
			const distance = py - top;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = t * t;
			fx = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
			fy = (Math.random() - 0.5) * 2 * strength * baseScale * forceStrength;
		}

		if (fx !== 0 || fy !== 0) {
			l.position = l.position.add(new paper.Point(fx, fy));
		}
	}
}

/**
 * Apply square bell force: placeholder for bell-curve behavior
 * @param {Array} letters - Array of Paper.js PointText items
 * @param {Point} mousePos - Current mouse position
 * @param {Number} mouseRadius - Half-size of the square
 * @param {Number} forceStrength - Strength multiplier of the force
 * @param {String} forceDirection - Direction of the square force
 */
function applySquareBellForce(
	letters,
	mousePos,
	mouseRadius,
	forceStrength,
	forceDirection = "right",
) {
	// mousePos is the center of the square; mouseRadius is the half-size (square spans ±mouseRadius)
	const dir = forceDirection || "right";
	const cx = mousePos.x;
	const cy = mousePos.y;
	const left = cx - mouseRadius;
	const right = cx + mouseRadius;
	const top = cy - mouseRadius;
	const bottom = cy + mouseRadius;
	const span = mouseRadius * 2; // full width/height

	for (let l of letters) {
		const px = l.position.x;
		const py = l.position.y;

		// Only affect letters inside the square bounds
		if (px < left || px > right || py < top || py > bottom) continue;

		const dx = px - cx;
		const dy = py - cy;

		let fx = 0;
		let fy = 0;

		// Falloff: weakest at the pushing edge (distance = 0), strongest at the opposite edge (distance = span).
		// Scale by a modest fraction of mouseRadius to keep visible effect without being overpowering
		const baseScale = mouseRadius * 0.5;

		// OPTION 15: Peak at Center - strongest in middle, weak at both edges (bell curve)
		if (dir === "right") {
			const distance = right - px;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = Math.sin(t * Math.PI); // bell curve peaking at t=0.5
			if (strength > 0) fx = strength * baseScale * forceStrength;
		} else if (dir === "left") {
			const distance = px - left;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = Math.sin(t * Math.PI);
			if (strength > 0) fx = -strength * baseScale * forceStrength;
		} else if (dir === "down") {
			const distance = bottom - py;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = Math.sin(t * Math.PI);
			if (strength > 0) fy = strength * baseScale * forceStrength;
		} else if (dir === "up") {
			const distance = py - top;
			const t = Math.max(0, Math.min(1, distance / span));
			const strength = Math.sin(t * Math.PI);
			if (strength > 0) fy = -strength * baseScale * forceStrength;
		}

		if (fx !== 0 || fy !== 0) {
			l.position = l.position.add(new paper.Point(fx, fy));
		}
	}
}
