const form = document.getElementById("add-form");
const list = document.getElementById("entries");

function loadEntries() {
    try{
        const saved = localStorage.getItem("alexandria-entries");
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}  
    
function saveEntries() {
    localStorage.setItem("alexandria-entries", JSON.stringify(entries));
}

let entries = loadEntries();
let nextId = entries.length ? Math.max(...entries.map(e => e.id)) + 1 : 1;

function render() {
    list.innerHTML = "";
    for (const entry of entries) {
        const card = document.createElement("div");
        card.className = "entry";

        const text = document.createElement("p");
        text.textContent = `${entry.title}, ${entry.type}, ${entry.status}, ${entry.site}, Chapter/Episode ${entry.progress}`;
        
        const actions = document.createElement("div");
        actions.className = "actions";

        const plusButton = document.createElement("button");
        plusButton.textContent = "+1"
        plusButton.addEventListener("click", function(){
            entry.progress += 1
            saveEntries();
            render();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function (){
            entries = entries.filter(e => e.id !== entry.id);
            saveEntries();
            render();
        });

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.value = entry.progress;

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", function(){
            if(input.value === "" || Number(input.value) < 0) return;
            entry.progress = Number(input.value);
            saveEntries();
            render();
        })

        actions.append(plusButton, deleteButton, input, updateButton);
        card.append(text, actions);
        list.appendChild(card);
    }
}

form.addEventListener("submit", function(event){
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    if (!title) return;
    entries.push({
        id: nextId,
        title: title,
        type: document.getElementById("type").value,
        site: document.getElementById("site").value,
        status: document.getElementById("status").value,
        progress: Number(document.getElementById("progress").value),
    })
    nextId += 1;
    saveEntries();
    form.reset();
    render();
})

render();
