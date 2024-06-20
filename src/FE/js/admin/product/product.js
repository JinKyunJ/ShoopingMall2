async function fetchProductList() {
  const productList = document.getElementById("product-list");
  const response = fetch("http://localhost:3002/products");
  const data = await response.json();
  const html = data.map(createProductHtml).join("");

  productList.innerHtml = html;
}

function createProductHtml({ product }) {
  const { price, image, title } = product;

  return `
        <li>
          <input type="checkbox" />
          <a href="#">
            <div class="img"><img src="${image}" alt="${title}" /></div>
            <div class="info">
              <p class="title">${title}</p>
              <p class="price">${price}원</p>
              <p></p>
            </div>
          </a>
        </li>
    `;
}

window.addEventListener("load", () => {
  fetchProductList();
});
