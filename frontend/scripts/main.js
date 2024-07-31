const items = document.querySelector("#listItems");
const tables = document.querySelector("#listTables");

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
    let fetchPromises = [];
    for (let i = 0; i < 39; i++) {
        fetchPromises.push(
            fetch(`${url}/tables/${i}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                tablesData[i] = data;
                viewTables(data);
            })
            .catch(error => console.error(`Error fetching table ${i}:`, error))
        );
    }

    return Promise.all(fetchPromises);
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

function fetchItemsData() {
    for (let i = 1; i < 545; i++) { //5456
        fetch(`${url}/items/${i}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            try {
                const jsonData = JSON.parse(data);
                viewItems(jsonData);
            } catch (e) {
                console.error(`Error parsing JSON for item ${i}:`, e);
            }
        })
        .catch(error => console.error(`Error fetching item ${i}:`, error));
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
                <div class="type ${data.type.toLowerCase()}">
                    <p>${data.type}</p>
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