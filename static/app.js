const BASE_URL = "http://localhost:5000/api";

/* simple function to generate html from list of cupcakes */
function generateHTML(cupcake) {
  return `
    <div data-cupcake-id=${cupcake.id}
        <li>
            ${cupcake.flavor} - ${cupcake.size} - ${cupcake.rating}
            <button class="delete-button btn btn-danger">X</button>           
        </li>
        <img class="cupcake-img"
            src="${cupcake.image}"
            alt="${cupcake.flavor} cupcake">
        
    </div>
    `;
}

/* call to api and get all cupcakes and display on rendered template */
async function displayCupcakes() {
  let allCupcakes = await axios.get(`${BASE_URL}/cupcakes`);

  for (let cupcake of allCupcakes.data.cupcakes) {
    let newCupcake = $(generateHTML(cupcake));
    $(".cupcakes").append(newCupcake);
  }
}

/* add new cupcake from form */
$("#cupcake-form").on("submit", async function(e) {
  e.preventDefault();

  let flavor = $("#form-flavor").val();
  let size = $("#form-size").val();
  let rating = $("#form-rating").val();
  let image = $("#form-image").val();

  const newCupcakeResponse = await axios.post(`${BASE_URL}/cupcakes`, {
    flavor,
    size,
    rating,
    image,
  });

  let newCupcake = $(generateHTML(newCupcakeResponse.data.cupcake));
  $(".cupcakes").append(newCupcake);
  $("#cupcake-form").trigger("reset");
});

/* Deletes individual cupcakes */
$(".cupcakes").on("click", ".delete-button", async function (e) {
  e.preventDefault();
  let $cupcake = $(e.target).closest("div");
  let cupcakeId = $cupcake.attr("data-cupcake-id");

  await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
  $cupcake.remove();
});

$(displayCupcakes);
