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
const ImageAdd = document.getElementById("ImageAdd");
const ImageDelete = document.getElementById("ImageDelete");
const detailImgElArr = document.getElementsByName("detail_image");
const detailBoxElArr = document.querySelectorAll(".detail_img_box");

async function fetchProduct() {
  try {
    const response = await fetch(`/products/${goodsId}`);
    const data = await response.json();
    const {
      image,
      title,
      price,
      detail_content,
      delivery,
      ad,
      sale,
      detail_image,
    } = data.product;
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
    detailImgElArr.forEach((input, idx) => {
      input.value = detail_image[idx];
      const img = document.createElement("img");
      img.src = `/img/TextImage/${input.value}`;
      img.title = title;
      detailBoxElArr[idx].append(img);
    });
  } catch (err) {
    console.log(err);
    alert("해당 상품이 없습니다.");
    location.href = "/admin/products";
  }
}

detailImgElArr.forEach((input) => {
  input.addEventListener("change", updateImgInput);
});
function updateImgInput() {
  const imgElArr = this.previousElementSibling.children;
  if (imgElArr[0].querySelector("img")) {
    imgElArr[0].removeChild(imgElArr[0].querySelector("img"));
  }

  const img = document.createElement("img");
  img.src = `/img/TextImage/${this.value}`;

  imgElArr[0].append(img);
}

ImageAdd.addEventListener("click", function () {
  const box = this.previousElementSibling;
  const div = document.createElement("div");
  const div2 = document.createElement("div");
  const input = document.createElement("input");
  div.className = "img_box";
  div2.className = "img";
  input.type = "text";
  input.name = "detail_image";
  div.append(div2);
  box.append(div);
  box.append(input);

  input.addEventListener("change", updateImgInput);
});

ImageDelete.addEventListener("click", function () {
  const box = this.parentElement.firstElementChild;
  box.removeChild(box.lastElementChild);
  box.removeChild(box.lastElementChild);
  console.log(box);
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const detailImages = formData.getAll("detail_image");
  formData.delete("detail_image"); // 기존의 개별 detailImages 값을 삭제
  formData.append("detail_image", detailImages); // 배열 추가
  const jsonData = Object.fromEntries(formData.entries());
  jsonData.detail_image = jsonData.detail_image.split(",");

  try {
    const response = await fetch(`/products/${goodsId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
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
