let theme = getTheme();
setTheme(theme);
changePageTheme(theme);

const SELECT_THEME = document.querySelector("#select-theme");
SELECT_THEME.addEventListener("change", function () {
    const SELECTED_THEME = SELECT_THEME.value;
    setTheme(SELECTED_THEME);
    changePageTheme(SELECTED_THEME);
});


function getTheme() {
    let theme = localStorage.getItem("theme");

    if (theme == null || theme == "") {
        localStorage.setItem("theme", "light");
        theme = "light";
    }

    return theme;
}

function setTheme(theme) {
    const SELECT_THEME = document.querySelector("#select-theme");
    SELECT_THEME.value = theme;

    localStorage.setItem("theme", theme);
}

function changePageTheme(theme) {
    const BODY = document.body;

    if (theme == "light") {
        if (BODY.classList.contains("dark")) {
            BODY.classList.remove("dark");
        }

        if (BODY.classList.contains("old")) {
            BODY.classList.remove("old");
        }
    } else {
        if (theme == "dark" && BODY.classList.contains("old")) {
            BODY.classList.remove("old");
        } else if (theme == "old" && BODY.classList.contains("dark")) {
            BODY.classList.remove("dark");
        }

        if (!BODY.classList.contains(theme)) {
            BODY.classList.add(theme);
        } 
    }
}