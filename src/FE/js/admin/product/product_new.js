const form = document.getElementById("poductInfoForm");
const imgInput = document.getElementById("image");
const detailImgInput = document.getElementsByName("detail_image");

imgInput.addEventListener("change", updateImgInput);
detailImgInput.forEach((input) => {
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

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const detailImages = formData.getAll("detail_image");
  formData.delete("detail_image"); // 기존의 개별 detailImages 값을 삭제
  formData.append("detail_image", detailImages); // 배열 추가
  const jsonData = Object.fromEntries(formData.entries());
  jsonData.detail_image = jsonData.detail_image.split(",");

  try {
    const response = await fetch(`/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    const data = await response.json();

    alert("상품 등록이 완료되었습니다.");
    //window.location.href = "/admin/products"; // 관리자 상품리스트 페이지로 이동
  } catch (err) {
    console.log(err);
    alert("상품 등록이 불가합니다. 다시 시도해주세요");
  }
});
