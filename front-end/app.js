//Elements HTML
const $userText = document.querySelector("#userText");
const $ul = document.querySelector("#listContainer");

//Ecoute sur l'input de creation des elements list
$userText.addEventListener("keydown", (e) => {
    if (e.key != "Enter") return;
    if (!e.currentTarget.value.trim()) return;
    createLiElement(e.currentTarget.value.trim());
    sendTOAPI(e.currentTarget.value.trim());
    e.currentTarget.value = "";
});

//Function pour creer les elements li, ajouter une écoute sur les interractions et l'ajouter au parent
function createLiElement(text) {
    const $li = document.createElement("li");
    $li.classList.add("listContainer-li");
    const $label = document.createElement("label");
    $label.textContent = text;
    const $checkbox = document.createElement("input");
    $checkbox.setAttribute("type", "checkbox");

    //Rayer le texte du label dans le li si la case est cochée
    $checkbox.addEventListener("change", (e) => {
        if (!e.currentTarget.checked) $label.style.textDecoration = "none";
        else $label.style.textDecoration = "line-through";
    });

    $label.prepend($checkbox);
    $li.appendChild($label);
    const $button = document.createElement("button");
    $button.innerHTML = `<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            height="24px"
                            width="24px"
                            fill="#e3e3e3"
                        >
                            <path
                                d="M6.4,19L5,17.6L10.6,12L5,6.4L6.4,5L12,10.6L17.6,5L19,6.4L13.4,12L19,17.6L17.6,19L12,13.4L6.4,19Z"
                            />
                        </svg>`;

    $li.appendChild($button);
    $ul.prepend($li);

    //Supprime la balise li et ses elements
    $button.addEventListener("click", () => {
        $li.remove();
    });
}

async function sendTOAPI(text) {
    const tab = {
        name: text,
        isChecked: false,
    };
    await fetch(`http://localhost:3000/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tab),
    });
}

async function getFromAPI(query) {
    let queryparams = "";
    if (query != undefined) {
        queryparams += `?isChecked=${query}`;
    }
    const request = await fetch("http://localhost:3000/tasks" + queryparams);
    const response = await request.json();
    response.forEach((element) => {
        createLiElement(element.name);
    });
}
