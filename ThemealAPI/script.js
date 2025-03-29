async function searchMeal() {
    const query = document.getElementById("search-input").value;
    if (!query) return;

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
            displayMeals(data.meals);
            document.getElementById("total-meals").textContent = data.meals.length || 0;
            return;
        }
        
        const ingredientResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
        const ingredientData = await ingredientResponse.json();
        
        if (ingredientData.meals && ingredientData.meals.length > 0) {
            displayMeals(ingredientData.meals);
            document.getElementById("total-meals").textContent = ingredientData.meals.length || 0;
        } else {
            document.getElementById("meal-gallery").innerHTML = "<p style='text-align:center;'>No meals found with this name or ingredient</p>";
            document.getElementById("total-meals").textContent = 0;
        }
    } catch (error) {
        console.error("Error fetching meals:", error);
        throw error;
    }
}

async function fetchRandomMeal() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        displayMeals(data.meals);
    } catch (error) {
        console.error("Error fetching random meal:", error);
        throw error;
    }
}

function displayMeals(meals) {
    const gallery = document.getElementById("meal-gallery");
    gallery.innerHTML = '';
    
    if (!meals || meals.length === 0) {
      gallery.innerHTML = '<p style="text-align:center;">No meals found</p>';
      document.getElementById("total-meals").textContent = 0;
      return;
    }
    
    meals.forEach(meal => {
      const item = document.createElement('div');
      item.className = 'item';
      
      item.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strMeal}</p>
        <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank">View Details</a>
      `;
      
      gallery.appendChild(item);
    });
    
    document.getElementById("total-meals").textContent = meals.length || 0;
  }

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        displayMeals(data.meals);
        document.getElementById("total-meals").textContent = "304";
        
        document.getElementById("search-input").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                searchMeal();
            }
        });
        
        document.getElementById("random-meal-btn").addEventListener("click", fetchRandomMeal);
        
    } catch (error) {
        document.getElementById('meal-gallery').innerHTML = '<p class="error">Error fetching meals.</p>';
    }
});