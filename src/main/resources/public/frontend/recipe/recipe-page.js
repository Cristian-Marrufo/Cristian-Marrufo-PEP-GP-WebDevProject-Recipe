/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const addRecipeInput = document.getElementById('add-recipe-name-input');
    const addRecipeInst = document.getElementById('add-recipe-instructions-input');
    const addRecipeSubmit = document.getElementById('add-recipe-submit-input');

    const updateRecipeInput = document.getElementById('update-recipe-name-input');
    const updateRecipeInst = document.getElementById('update-recipe-instructions-input');
    const updateRecipeSubmit = document.getElementById('update-recipe-submit-input');

    const deleteRecipeInput = document.getElementById('delete-recipe-name-input');
    const deleteRecipeSubmit = document.getElementById('delete-recipe-submit-input');

    const recipeList = document.getElementById('recipe-list');
    
    const adminLink = document.getElementById('admin-link');
    const logoutButton = document.getElementById('logout-button');

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if(sessionStorage.getItem('auth-token') !== null) {
        logoutButton.hidden = false;
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if(sessionStorage.getItem('is-admin') === 'true') {
        adminLink.hidden = false;
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmit.addEventListener('click', addRecipe);
    updateRecipeSubmit.addEventListener('click', updateRecipe);
    deleteRecipeSubmit.addEventListener('click', deleteRecipe);
    searchButton.addEventListener('click', searchRecipes);
    logoutButton.addEventListener('click', processLogout);
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTerm = searchInput.value;
        recipes = recipes.filter(recipe => 
            recipe.name === searchTerm
        );
        
        refreshRecipeList();
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const addRecipeInputVal = addRecipeInput.value;
        const addRecipeInstVal = addRecipeInst.value;

        const recipeBody = {
            name: addRecipeInputVal,
            instructions: addRecipeInstVal
        };
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify(recipeBody)
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);

            if(!response.ok) {
                throw new Error('Failed to add recipe');
            }

            await getRecipes();

        } catch (error) {
            console.log(error.message);
            alert(`Error: ${error.message}`);
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const updateRecipeInputVal = updateRecipeInput.value;
        const updateRecipeInstVal = updateRecipeInst.value;
        const recipe = recipes.find(recipe => 
            recipe.name === updateRecipeInputVal
        );

        if(recipe === undefined) {
            alert('Recipe not found');
            return;
        }

        recipe.instructions = updateRecipeInstVal;
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify(recipe)
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, requestOptions);

            if(!response.ok) {
                throw new Error('Failed to update recipe');
            }

            await getRecipes();

        } catch (error) {
            console.log(error.message);
            alert(`Error: ${error.message}`);
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const deleteRecipeInputVal = deleteRecipeInput.value;
        const recipe = recipes.find(recipe =>
            recipe.name === deleteRecipeInputVal
        );

        if(recipe === undefined) {
            alert('Recipe not found');
            return;
        }

        const requestOptions = {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, requestOptions);

            if(!response.ok) {
                throw new Error('Failed to delete recipe');
            }

            await getRecipes();

        } catch (error) {
            console.log(error.message);
            alert(`Error: ${error.message}`);
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);

            if(!response.ok) {
                throw new Error('Failed to get recipes');
            }

            recipes = await response.json();
            refreshRecipeList();

        } catch (error) {
            console.log(error.message);
            alert(`Error: ${error.message}`);
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";

        for(const recipe of recipes) {
            const listItem = document.createElement('li');

            listItem.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeList.appendChild(listItem);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token") 
            }
        };

        try {
            const response = await fetch(`${BASE_URL}/logout`, requestOptions);

            if(!response.ok) {
                throw new Error('Failed to logout');
            }

            sessionStorage.removeItem("auth-token");
            sessionStorage.removeItem("is-admin");

            window.location.href = '../login/login-page.html';

        } catch (error) {
            console.log(error.message);
            alert(`Error: ${error.message}`);
        }
    }
});
