/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById('add-ingredient-name-input');
const addIngredientSubmit = document.getElementById('add-ingredient-submit-button');

const deleteIngredientNameInput = document.getElementById('delete-ingredient-name-input');
const deleteIngredientSubmit = document.getElementById('delete-ingredient-submit-button');

const ingredientListContainer = document.getElementById('ingredient-list');
/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientSubmit.addEventListener('click', addIngredient);
deleteIngredientSubmit.addEventListener('click', deleteIngredient);
/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];
/* 
 * TODO: On page load, call getIngredients()
 */
window.addEventListener("DOMContentLoaded", getIngredients);

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const ingredientName = addIngredientNameInput.value.trim();
    
    if(ingredientName === '') {
        alert('Add ingredient name');
        return;
    }

    const ingredientBody = {
        name: ingredientName
    };
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        },
        body: JSON.stringify(ingredientBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if(!response.ok) {
            throw new Error('Failed to add ingredient');
        }

        await getIngredients();
        addIngredientNameInput.value = "";

    } catch (error) {
        console.log(error.message);
        alert(`Error: ${error.message}`);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    const requestOptions = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        }
    };

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if(!response.ok) {
            throw new Error('Failed to get ingredients');
        }
        
        ingredients = await response.json();
        refreshIngredientList();

    } catch (error) {
        console.log(error.message);
        alert(`Error: ${error.message}`);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const ingredientName = deleteIngredientNameInput.value.trim();
    const ingredient = ingredients.find(ingredient =>
        ingredient.name.toLowerCase() === ingredientName.toLowerCase()
    )

    if(ingredient === undefined) {
        alert('Ingredient not found');
        return;
    }

    const requestOptions = {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        }
    };

    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, requestOptions);

        if(!response.ok) {
            throw new Error('Failed to delete ingredient');
        }

        await getIngredients();
        deleteIngredientNameInput.value = "";
        
    } catch (error) {
        console.log(error.message);
        alert(`Error: ${error.message}`);
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";

    for(const ingredient of ingredients) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<p>${ingredient.name}</p>`;

        ingredientListContainer.appendChild(listItem);
    }
}
