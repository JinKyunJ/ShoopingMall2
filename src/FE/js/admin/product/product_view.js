const goodsId = window.location.search.replace("?=", "");
const form = document.getElementById("poductInfoForm");
const imgEl = document.getElementById("img");
const goodsIdEl = document.getElementById("goodsId");
const goodsNameInput = document.getElementById("goodsName");
const goodsPriceInput = document.getElementById("goodsPrice");
const goodsShortText = document.getElementById("ad");
const detailTextArea = document.getElementById("detail_content");
const deliveryInput = document.getElementById("delivery");
const saleInput = document.getElementById("sale");
const imageInput = document.getElementById("image");

async function fetchProduct() {
  try {
    const response = await fetch(`/products/${goodsId}`);
    const data = await response.json();
    const { image, title, price, detail_content, delivery, ad, sale } =
      data.product;
    console.log(data);
    const img = document.createElement("img");
    img.src = `/img/TextImage/${image}`;
    imageInput.value = `${image}`;
    img.title = title;
    imgEl.append(img);
    goodsIdEl.value = goodsId;
    goodsNameInput.value = title;
    goodsPriceInput.value = price;
    detailTextArea.value = detail_content;
    deliveryInput.value = delivery;
    goodsShortText.value = ad;
    saleInput.value = sale;
  } catch (err) {
    console.log(err);
    alert("해당 상품이 없습니다.");
    location.href = "/admin/products";
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

  try {
    const response = await fetch(`/products/${goodsId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    });
    const data = await response.json();

    alert("상품 수정이 완료되었습니다.");
    window.location.href = "/admin/products"; // 관리자 상품리스트 페이지로 이동
  } catch (err) {
    console.log(err);
    alert("상품 수정이 불가합니다. 다시 시도해주세요");
  }
});

window.addEventListener("load", () => {
  fetchProduct();
});
