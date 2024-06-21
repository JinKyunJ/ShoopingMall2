const allCheckInput = document.getElementById("allCheck");
const delteBtn = document.getElementById("deleteList");

async function fetchProductList() {
  const productList = document.getElementById("product-list");
  const response = await fetch("/products");
  const data = await response.json();
  const html = data.map(createProductHtml).join("");
  productList.innerHTML = html;
}

function createProductHtml({ product }) {
  const { price, image, title, nanoid } = product;

  return `
        <li>
          <input type="checkbox" name="productCheck" value="${nanoid}" />
          <a href="/admin/product/view?=${nanoid}">
            <div class="img"><img src="/img/TextImage/${image}" alt="${title}" /></div>
            <div class="info">
              <p class="title">${title}</p>
              <p class="price">${price.toLocaleString("ko-KR")}원</p>
              <p></p>
            </div>
          </a>
        </li>
    `;
}

delteBtn.addEventListener("click", deleteProduct);

function deleteProduct() {
  const input = Array.from(document.getElementsByName("productCheck"));
  const checkedInput = input.filter((input) => input.checked);
  checkedInput.forEach(async (input) => {
    await fetch(`/products/${input.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  fetchProductList();
}

// 모두 선택 체크박스 클릭
allCheckInput.addEventListener("click", () => {
  const input = Array.from(document.getElementsByName("productCheck"));
  const isAllChecked = allCheckInput.checked;

  input.forEach((input) => {
    input.checked = isAllChecked;
  });
});

window.addEventListener("load", () => {
  fetchProductList();
});
