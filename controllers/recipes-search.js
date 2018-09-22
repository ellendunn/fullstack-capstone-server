const unirest = require('unirest')

exports.getRecipesByIngredients = (req, res) => {
  const queryString = req.body.ingredients.join('%2C');
  unirest.get(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=${queryString}&number=5&ranking=1`)
    .header("X-Mashape-Key", process.env.RECIPES_KEY)
    .header("X-Mashape-Host", "spoonacular-recipe-food-nutrition-v1.p.mashape.com")
    .end(function (result) {
      res.send(result.body);
    })
}

exports.getRecipeById = (req, res) => {
  console.log(req.params, 'IM HERE')
  const recipeId = req.params.id;
  unirest.get(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${recipeId}/information`)
    .header("X-Mashape-Key", process.env.RECIPES_KEY)
    .header("X-Mashape-Host", "spoonacular-recipe-food-nutrition-v1.p.mashape.com")
    .end(function (result) {
      res.send(result.body);
    })
}
