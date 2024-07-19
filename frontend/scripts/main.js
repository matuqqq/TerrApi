const itemsFilter = document.querySelector("#pipi");
const tablesFilter = document.querySelector("#pipi");

let url = "www.github/";

//Recorrer items
for(let i = 0; i < 5456; i++){
    fetch(`${url}/items/${i}`)
}

//Recorrer Tables
for(let i = 0; i < 35; i++){
    fetch(`${url}/tables/${i}`)
}