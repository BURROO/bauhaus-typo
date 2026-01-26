class TextBlock {
    constructor(container) {
        this.container = container;
        this.create();
        this.enableDragging();
        this.enableResizeFont();
        this.enableLoremFill();
    }

    create() {
        this.wrapper = document.createElement("div");
        this.wrapper.className = "textblock-wrapper";
        this.wrapper.style.left = "50px";
        this.wrapper.style.top = "50px";

        this.textarea = document.createElement("textarea");
        this.textarea.className ="textblock";
        this.textarea.placeholder = "…";

        this.wrapper.appendChild(this.textarea);
        this.container.appendChild(this.wrapper);
    }

    enableDragging() {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        this.wrapper.addEventListener("mousedown", (e) => {
            const r = this.wrapper.getBoundingClientRect();
            const margin = 16;

            const nearRight = e.clientX >= r.right - margin;
            const nearBottom = e.clientY >= r.bottom - margin;
            
            if (nearRight && nearBottom) return;
            if (e.target === this.textarea) return;

            isDragging = true;
            offsetX = e.clientX - this.wrapper.offsetLeft;
            offsetY = e.clientY - this.wrapper.offsetTop;
            this.wrapper.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            this.wrapper.style.left = `${e.clientX - offsetX}px`;
            this.wrapper.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            this.wrapper.style.cursor = "move";
        });
    }

    enableResizeFont() {
        new ResizeObserver(() => {
            const width = this.wrapper.offsetWidth;
            this.textarea.style.fontSize = width / 20 + "px";
        }).observe(this.wrapper);
    }

    enableLoremFill() {
        this.textarea.addEventListener("keydown", e => {
            if (!this.textarea.value) return;

                this.textarea.value = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanct";
                this.textarea.selectionStart = this.textarea.selectionEnd = this.textarea.value.length;
                e.preventDefault();
        });
    }
}

//Create new blocks on button click

const container = document.getElementById("container");
const addBtn = document.getElementById("add-textblock");

addBtn.addEventListener("click", () => {
    new TextBlock(container);
});