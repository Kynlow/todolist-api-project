//Elements HTML
const $userText = document.querySelector("#userText");
const $ul = document.querySelector("#listContainer");
const $PitemsLeft = document.querySelector("#PitemsLeft");
const $active = document.querySelector("#active");
const $completed = document.querySelector("#completed");

document.addEventListener("DOMContentLoaded", () => {
    getFromAPI();
});

//Ecoute sur l'input de creation des elements list
$userText.addEventListener("keydown", (e) => {
    if (e.key != "Enter") return;
    if (!e.currentTarget.value.trim()) return;
    $PitemsLeft.textContent = parseInt($PitemsLeft.textContent) + 1;

    createLiElement({ name: e.currentTarget.value.trim(), id: Date.now() });
    sendTOAPI({ naame: e.currentTarget.value.trim(), id: Date.now() });
    e.currentTarget.value = "";
});

//Ecoute sur les boutons pour les filtres
$active.addEventListener("click", () => {
    getFromAPI(false);
});

$completed.addEventListener("click", () => {
    getFromAPI(true);
});

//Function pour creer les elements li, ajouter une écoute sur les interractions et l'ajouter au parent
function createLiElement(text) {
    const $li = document.createElement("li");
    $li.classList.add("listContainer-li");
    $li.dataset.id = text.id;
    const $label = document.createElement("label");
    $label.textContent = text.name;
    const $checkbox = document.createElement("input");
    $checkbox.setAttribute("type", "checkbox");

    //Rayer le texte du label dans le li si la case est cochée
    $checkbox.addEventListener("change", (e) => {
        if (!e.currentTarget.checked) {
            $label.style.textDecoration = "none";
            $PitemsLeft.textContent = parseInt($PitemsLeft.textContent) + 1;
        } else {
            $label.style.textDecoration = "line-through";
            $PitemsLeft.textContent = parseInt($PitemsLeft.textContent) - 1;
        }
        patchAPI($li.dataset.id);
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
        if (!$checkbox.checked)
            $PitemsLeft.textContent = parseInt($PitemsLeft.textContent) - 1;

        deleteAPI($li.dataset.id);
    });
}

async function sendTOAPI(text) {
    const tab = {
        name: text.naame,
        isChecked: false,
        id: text.id,
    };
    await fetch(`http://localhost:3008/tasks`, {
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
    const request = await fetch("http://localhost:3008/tasks" + queryparams);
    const response = await request.json();
    if (!response) return;
    $$PitemsLeft.textContent = response.length;
    $ul.innerHTML = "";
    response.forEach((element) => {
        createLiElement(element);
    });
}

async function patchAPI(element) {
    await fetch(`http://localhost:3008/tasks/${element}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
}

async function deleteAPI(element) {
    await fetch(`http://localhost:3008/tasks/${element}`, {
        method: "DELETE",
    });
}
