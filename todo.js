// Määritellään pakolliset muuttujat

const textField = document.getElementById('text-field');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

// Määritellään taulukko tallennusta varten
let storageArray = [];

// Ladataan tiedot localstoragesta
loadSession();

// Lisätään kuuntelija +-nappiin
addButton.addEventListener('click', function(){
    if (textField.value === ''){
        showAlert();
        return; // Jos käyttäjä antaa virheellisen syötteen (tyhjä), näytetään ilmoitus ja palataan looppiin
    } else {
        addListElement(textField.value, false); // Add the new task (unchecked by default)
        saveSession(); // Save the updated task list
        textField.value = ''; // Clear the input field
    }
});

// Tyhjän syötteen varoitusfunktio
function showAlert(){
    alert('Lisää tehtävä, kiitos!'); // Pop up ilmoitus
    textField.style.background = '#E9B15D'; // Kentän värikoodaus virheen yhteydessä (2,5 sec)
    setTimeout(function(){
        textField.style.background = 'transparent';
    }, 2500);
}

// Todo-listan entryjä käsittelevä funktio
function addListElement(taskText, isChecked){
    let listElement = document.createElement('li'); // Uusi li-elemntti

    let textContainer = document.createElement('span'); // Tekstisyötteen lisäys text-span elementtiin
    textContainer.textContent = taskText;
    textContainer.className = 'text-container';
    listElement.appendChild(textContainer)

    let buttonContainer = document.createElement('span'); // Uusi span-elementti checkbox -ja delete-napeille
    buttonContainer.className = 'button-container';
    listElement.appendChild(buttonContainer)
    
    let checkBox = document.createElement('input'); // Checkboxin lisäys button span-elementtiin
    checkBox.type = 'checkbox';
    checkBox.className = 'checkbox-css';
    buttonContainer.appendChild(checkBox);

    let deleteButton = document.createElement('button'); // Delete-napin lisäys button span-elementtiin
    deleteButton.textContent = 'X';
    deleteButton.className = 'deletebutton-css';
    buttonContainer.appendChild(deleteButton);

    todoList.appendChild(listElement) // koko listaelementin lisäys todo-listaan
    
    checkBox.checked = isChecked; // checkboxin tila

    if (isChecked){ // lisää linethrough, jos checkattu
        textContainer.style.textDecoration = 'line-through';
    }

    // tehtävän yliviivaus (tai yliviivauksen poisto)
    checkBox.addEventListener('click', function(){
        if (checkBox.checked){
            textContainer.style.textDecoration = 'line-through';
        } else {
            textContainer.style.textDecoration = 'none';
        }
        saveSession(); // tallenna checkboxin tila klikkauksen jälkeen
    });

    // Poista lisätty todo-entry (listaelementti sisältöineen)
    deleteButton.addEventListener('click', function(){
        listElement.remove();
        saveSession(); // tallenna poisto
    });
}

// tallennus localstorageen
function saveSession(){
    todoList.querySelectorAll('li').forEach(function(listElement){ // käydään kaikkien li-elementtien läpi
        let taskText = listElement.firstChild.textContent; // haetaan teksti 
        let isChecked = listElement.querySelector('input[type="checkbox"]').checked; // haetaan checkboxin tila
        storageArray.push({ // Lisää haetut tiedot taulukkoon objektina
            text: taskText,
            checked: isChecked
        });
    });

    // tallennetaan taulukko localstorageen
    localStorage.setItem('saveData', JSON.stringify(storageArray));

    storageArray = []; // Tyhjennetään taulukko
}

// tallennettujen tietojen haku localstoragesta
function loadSession(){
    let retrieveData = JSON.parse(localStorage.getItem('saveData')) || [];

    retrieveData.forEach(function(task){ // Käydään tallenteet läpi ja lisätään ne todo-listaan
        addListElement(task.text, task.checked);
    });
}
