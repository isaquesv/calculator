let isMouseDown = false;
let startX;
let scrollLeft;

const DISPLAY_ELEMENT = document.querySelector("#display");

// Evento para iniciar o arraste
DISPLAY_ELEMENT.addEventListener("mousedown", function (e) {
    isMouseDown = true;
    startX = e.pageX - DISPLAY_ELEMENT.offsetLeft;
    scrollLeft = DISPLAY_ELEMENT.scrollLeft;
    DISPLAY_ELEMENT.style.cursor = "grabbing";
});

// Evento para arrastar
DISPLAY_ELEMENT.addEventListener("mousemove", function (e) {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - DISPLAY_ELEMENT.offsetLeft;
    const walk = (x - startX) * 2;
    DISPLAY_ELEMENT.scrollLeft = scrollLeft - walk;
});

function stopDragging() {
    isMouseDown = false;
    DISPLAY_ELEMENT.style.cursor = "default";
}

// Evento para finalizar o arraste
DISPLAY_ELEMENT.addEventListener("mouseup", stopDragging);
// Evento para cancelar o arraste se o mouse sair da área do input
DISPLAY_ELEMENT.addEventListener("mouseleave", stopDragging);

export function adjustDisplay() {
    if (DISPLAY_ELEMENT.scrollWidth > DISPLAY_ELEMENT.clientWidth) {
        DISPLAY_ELEMENT.scrollLeft = DISPLAY_ELEMENT.scrollWidth;
    }
}