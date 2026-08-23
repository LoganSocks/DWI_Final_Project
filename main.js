// this will hold the two example dinos
const Dino_Database = [
    // sets the species name and the title of its coresponding image
    { species: "T-Rex", imageFile: "trex.png", parts: [
        // set the name and picyure for each fossil
        { name: "Skull", found: false, icon: "🦖", partOrder: 1 },
        { name: "Ribs", found: false, icon: "🩻", partOrder: 2 },
        { name: "Tail", found: false, icon: "🦴", partOrder: 3 }
    ]},//do the same as above for the triceratops
    { species: "Triceratops", imageFile: "triceratops.png", parts: [
        { name: "Horns", found: false, icon: "🦏", partOrder: 1 },
        { name: "Torso", found: false, icon: "🩻", partOrder: 2 },
        { name: "Tail", found: false, icon: "🦴", partOrder: 3 }
    ]}
];
// this will hold wat level the user is on either trex or trike
let Current_Level = 0;
// how many fossils the user currently has
let Current_Fossils = [];
// the collection which holds the fossils after a whole specimen is collected
let My_Collection = []; 
// this will load a board with random fossil locations
function Load_Level() {
    // check if the level is higher than the current amount of dinos
    if (Current_Level >= Dino_Database.length) {
        // if it is reset the level to 0
        Current_Level = 0; 
    }
    // makes a copy of the dino so the database does not get corupted if changes occur
    Current_Fossils = JSON.parse(JSON.stringify(Dino_Database[Current_Level].parts));
    // call the functuon tor randomly place the fossils
    Randomize_Fossil_Locations();
    // call the function to make the grid
    Generate_Grid();
    // cal the function to update th eusers inventory
    Update_Inventory_UI();
}
// function to randomly place the fossils on the grid
function Randomize_Fossil_Locations() {
    // make a list for positions that have been prviously used
    let Used_Positions = [];
    // loops through the fossil pieces in the current level
    Current_Fossils.forEach(fossil => {
        // this will hold the random number of the positioin
        let Random_Pos;
        do {
            // get a random number
            Random_Pos = Math.floor(Math.random() * 100);
            // make sure the number is not already used
        } while (Used_Positions.includes(Random_Pos));
        // set the fossil to the random position
        fossil.position = Random_Pos;
        // add the random postion to the used positions
        Used_Positions.push(Random_Pos);
    });
}
// this function will make the grid
function Generate_Grid() {
    // finds where the grid should go
    const Dig_Site = document.getElementById('Dig_Site');
    //gets rid of any old grid
    Dig_Site.innerHTML = ''; 
    // this will loop 100 times to make a 10 by 10 grid
    for (let i = 0; i < 100; i++) {
        //makes a temp empty div
        const tile = document.createElement('div');
        //make the grid look like dirt using the styles
        tile.classList.add('Dirt_Patch');
        //attatches the current loop number
        tile.dataset.index = i; 
        //this looks for a click nd will trigger the spot to be dug if it sense one
        tile.addEventListener('click', Handle_Dig);
        // places the new square on the page
        Dig_Site.appendChild(tile);
    }
}
// this funciton will run when a user digs a square
function Handle_Dig(event) {
    // ake the clicked tile where the event will happen at
    const Clicked_Tile = event.target;
    // reads the number attacthed earlier to see where we clicked
    const Tile_Index = parseInt(Clicked_Tile.dataset.index);
    //if the spot has already been dug exit here
    if (Clicked_Tile.classList.contains('Excavated')) return;
    //make the square look dug up
    Clicked_Tile.classList.add('Excavated');
    //sees if a fossil was where we clicked
    const Found_Fossil = Current_Fossils.find(f => f.position === Tile_Index);
    // checks if there is a fossil
    if (Found_Fossil && !Found_Fossil.found) {
        // change the fossil so it is recognized as discovered
        Found_Fossil.found = true; 
        //put the placeholder images where the fossil was founf
        Clicked_Tile.innerHTML = Found_Fossil.icon; 
        //call the update inbventory function
        Update_Inventory_UI(); 
    }
}
// this function will update the ui
function Update_Inventory_UI() {
    // get these items by their id's
    const Inventory_List = document.getElementById('Inventory_List');
    const Latest_Fossil_Img = document.getElementById('Latest_Fossil_Img');
    const Progress_Bar = document.getElementById('Fossil_Progress');
    const Dynamic_Info = document.getElementById('Dynamic_Info');
    //clear the old inventory text
    Inventory_List.innerHTML = '';
    //initilaize the items found to 0 
    let Items_Found = 0;
    //placeholders for fossils
    let Assembled_Dino = ["", "", ""]; 
    //loop through completed dinosaurs
    My_Collection.forEach(dino => {
        // for each completed dino make a new list
        const li = document.createElement('li');
        // make the content of the list tge colledcted dino
        li.textContent = `✔️ ${dino.species} (Collected)`;
        // append the collected dino to the usets inventory
        Inventory_List.appendChild(li);
    });
    // loop through the bones currently availblw
    Current_Fossils.forEach(fossil => {
        //check if the fossil has been found
        if (fossil.found) {
            //add it to the list on the sidebar
            const li = document.createElement('li');
            li.textContent = `New: ${fossil.icon} ${fossil.name}`;
            Inventory_List.appendChild(li);
            //put the placeholder emojis in the correct positions
            Assembled_Dino[fossil.partOrder - 1] = fossil.icon;
            //increment the items found
            Items_Found++;
        }
    });
    //update the visual box
    Latest_Fossil_Img.innerHTML = Assembled_Dino.join(" ");
    //increase the orogress bar
    Progress_Bar.style.width = `${(Items_Found / Current_Fossils.length) * 100}%`;
    //let the user know what they are looking for
    Dynamic_Info.textContent = `Currently excavating: The ${Dino_Database[Current_Level].species}`;
}
//function to restart the dig site
function Restart_Game() {
    //checks to see if all fossils have been found
    const Is_Complete = Current_Fossils.every(f => f.found === true);
    //if they have all been found
    if (Is_Complete) {
        //add the whole dino to the collection
        My_Collection.push(Dino_Database[Current_Level]);
        //go to the next level
        Current_Level++; 
    } else {
        //let the user know there were more fossils to be found
        alert("Dig reset! You abandoned the site before finishing the skeleton.");
    }
    //load the level
    Load_Level();
}

// function for the collection screen
function Open_Collection_Modal() {
    //find the backgorund and the image
    const Modal = document.getElementById('Collection_Modal');
    const Gallery = document.getElementById('Collection_Gallery');
    //clear the old gallery
    Gallery.innerHTML = ''; 
    //check if the users collection is empty
    if (My_Collection.length === 0) {
        // let them know they have no dinos
        Gallery.innerHTML = '<p>No dinosaurs collected yet. Keep digging!</p>';
    } else {
        // if they have dinos display the image and name of each dino
        My_Collection.forEach(dino => {
            const Img_Element = document.createElement('img');
            Img_Element.src = dino.imageFile;
            Img_Element.alt = dino.species;
            Img_Element.title = dino.species; 
            Gallery.appendChild(Img_Element);
        });
    }
    //make it visible to the user
    Modal.classList.add('show');
}
// function to close the collection screen
function Close_Collection_Modal() {
    document.getElementById('Collection_Modal').classList.remove('show');
}
//function to run when exit is pressed
function Exit_App() {
    // Show a confirmation dialog
    const Confirm_Exit = confirm("Are you sure you want to exit the dig site?");
    
    if (Confirm_Exit) {
        // Redirect to a blank screen to simulate closing the app
        window.location.href = "about:blank";
    }
}
//iniitialiaztion
window.onload = () => {
    //sets up the first board
    Load_Level();
    //this will hold teh restart button
    const Restart_Btn = document.getElementById('Restart_Btn');
    //check if the restart button was clicked
    if (Restart_Btn) Restart_Btn.addEventListener('click', Restart_Game);
    //finds the collection buttons and attachtes the screens
    const Collection_Btn = document.getElementById('Collection_Btn');
    const Close_Btn = document.getElementById('Close_Modal');
    if (Collection_Btn) Collection_Btn.addEventListener('click', Open_Collection_Modal);
    if (Close_Btn) Close_Btn.addEventListener('click', Close_Collection_Modal);
    //attaches the exit function to the exit button
    const Exit_Btn = document.getElementById('Exit_Btn');
    if (Exit_Btn) Exit_Btn.addEventListener('click', Exit_App);
};