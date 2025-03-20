const items = document.querySelector("#listItems");
const tables = document.querySelector("#listTables");
//total de items 5456

let url = "http://127.0.0.1:3000";

const rarityMap = {
    "-1": "gray",
    "0": "white",
    "1": "blue",
    "2": "green",
    "3": "orange",
    "4": "light-red",
    "5": "pink",
    "6": "light-purple",
    "7": "lime",
    "8": "yellow",
    "9": "cyan",
    "10": "red",
    "11": "purple",
    "12": "rainbow",
    "13": "master",
    "14": "quest"
};

const tablesData = {};

function fetchTablesData() {
    return fetch(`${url}/tables`)
        .then(response => response.json())
        .then(data => {
            data.forEach(table => {
                tablesData[table.id] = table;
                viewTables(table);
            });
        })
        .catch(error => console.error("Error fetching tables:", error));
}

function viewTables(data) {
    const div = document.createElement("div");
    const simplyId = parseInt(data.id, 10);

    div.classList.add("table");
    div.innerHTML = `
        <p class="id-back">${"#" + data.id}</p>
        <div class="img">
            <img src="${data.img}" alt="${data.name}">
        </div>
        <div class="table-text">
            <div class="title">
                <p class="title-id">${"#" + data.id}</p>
                <h2 class="title-name">${data.name}</h2>
            </div>
            <div class="table-data">
                <div class="table-item ${"t" + simplyId}">
                    <img src="${data.img}" alt="${data.name}">
                </div>
            </div>
        </div>
    `;
    tables.append(div);
}

async function fetchItemsData() {
    const batchSize = 100; // Lotes de 100 items
    const totalItems = 545; // Total de items
    for (let i = 1; i < totalItems; i += batchSize) {
        const requests = [];
        
        for (let j = i; j < i + batchSize && j < totalItems; j++) {
            requests.push(fetch(`${url}/items/${j}`)
                .then(response => response.ok ? response.json() : null)
                .catch(error => {
                    console.error(`Error fetching item ${j}:`, error);
                    return null;
                })
            );
        }

        const results = await Promise.all(requests);
        results.forEach(data => {
            if (data) viewItems(data);
        });

        await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa
    }
}


function viewItems(data) {
    const div = document.createElement("div");
    const tableId = (data.table === "none" ? "27" : data.table) || "defaultTableId";
    div.classList.add("item");

    const rarityColor = rarityMap[data.rarity] || "unknown";
    const tableData = tablesData[tableId] || {};
    const tableImgSrc = tableId === "27"
        ? "https://static.wikia.nocookie.net/terraria_gamepedia/images/b/b3/Chest.png"
        : (tableData.img || "https://static.wikia.nocookie.net/terraria_gamepedia/images/b/b3/Chest.png");

    const tableImgAlt = tableData.name || "Table image";

    // ✅ Manejo seguro del type
    const itemType = data.type && typeof data.type === "string" && data.type !== "none" 
        ? data.type.toLowerCase() 
        : "unknown";

    div.innerHTML = `
        <p class="id-back">${"#" + data.id}</p>
        <div class="img">
            <img src="${data.img}" alt="${data.name}">
        </div>
        <div class="item-text">
            <div class="title">
                <p class="title-id">${"#" + data.id}</p>
                <h2 class="title-name">${data.name}</h2>
            </div>
            <div class="item-data">
                <div class="type ${itemType}">
                    <p>${itemType}</p>
                </div>
                <div class="rarity ${rarityColor} ${"r" + data.rarity}">
                    <p>${rarityColor}</p>
                </div>
                <div class="tables ${"t" + tableId}">
                    <img src="${tableImgSrc}" alt="${tableImgAlt}">
                </div>
            </div>
        </div>
    `;
    items.append(div);
}


fetchTablesData().then(() => {
    fetchItemsData();
});

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        const top = section.getBoundingClientRect().top + window.pageYOffset;
        const offset = -120;

        window.scrollTo({
            top: top + offset,
            behavior: 'smooth'
        });
    }
}
let allItems = [];

// Función para filtrar los ítems
function filterItems() {
    const selectedTypes = [...document.querySelectorAll(".filter-type input:checked")]
        .map(input => input.id.toUpperCase());
    const selectedRarities = [...document.querySelectorAll(".filter-rarity input:checked")]
        .map(input => input.id);

    const itemsContainer = document.getElementById("listItems");
    itemsContainer.innerHTML = ""; // Limpiar la lista antes de mostrar los filtrados

    allItems.forEach(item => {
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type?.toUpperCase());
        const matchesRarity = selectedRarities.length === 0 || selectedRarities.includes(item.rarity?.toString());

        if (matchesType && matchesRarity) {
            viewItems(item); // Agregar el ítem filtrado al DOM
        }
    });
}

// Configurar los eventos de los filtros
function setupFilters() {
    document.querySelectorAll(".filter input").forEach(input => {
        input.addEventListener("change", filterItems);
    });

    document.getElementById("view-all").addEventListener("click", () => {
        document.querySelectorAll(".filter input").forEach(input => input.checked = false);
        filterItems(); // Mostrar todos los ítems
    });
}

// Función para cargar los ítems desde la API
function fetchItemsData() {
    fetch("http://127.0.0.1:3000/items") // Cambia esta URL si es necesario
        .then(response => response.json())
        .then(data => {
            allItems = data;
            filterItems(); // Mostrar los ítems después de cargarlos
        })
        .catch(error => console.error("Error al obtener los ítems:", error));
}

// Llamada para cargar los ítems y configurar los filtros al cargar la página
fetchItemsData();
setupFilters();

