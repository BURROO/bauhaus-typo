window.addEventListener("DOMContentLoaded", () => {

    const svg = document.getElementById("scene");
    const weightControl = document.getElementById("control-wght");
    const variationControl = document.getElementById("control-Variation");

    const fullPath = document.getElementById("A-grow");
    const totalLength = fullPath.getTotalLength();

    let progress = 0;
    let segmentLength = 2; 
    let segments = [];
    let isGrowing = false; // ★ variation 움직이기 전에는 grow 금지

    // grow 시작 함수
    function startGrow() {
        if (isGrowing) return; // 이미 실행 중이면 중복 실행 방지
        isGrowing = true;

        // 기존 선들 삭제
        segments.forEach(seg => seg.remove());
        segments = [];
        progress = 0;

        requestAnimationFrame(grow);
    }

    // variation 슬라이더 움직일 때만 grow 시작
    variationControl.addEventListener("input", () => {
        segmentLength = variationControl.value / 20;

        isGrowing = false; // 다시 0부터 시작하기 위해 unlock
        startGrow();
    });

    function grow() {
        if (progress >= totalLength) return;

        const p1 = fullPath.getPointAtLength(progress);
        const p2 = fullPath.getPointAtLength(progress + segmentLength);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p1.x);
        line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x);
        line.setAttribute("y2", p2.y);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", weightControl.value / 100);

        document.getElementById("grow-wrapper").appendChild(line);
        segments.push(line);

        progress += segmentLength;

        requestAnimationFrame(grow);
    }

    // ★ 초기에는 아무것도 하지 않음
    // grow() 자동 실행 없음
});
