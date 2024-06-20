//<summary>
//TagId : 매개변수로 이동하려고하는 섹션(위치) id 입니다
// behavior : smooth는 scrollintoviw메소드의 속성입니다. 에니메이션의 방식을 정의하고 두가지 값중 선택합니다
//smooth는 부드럽게 이동 auto 즉시 이동
function OnScrollSection(TagId)
{
    document.getElementById(TagId).scrollIntoView({behavior : 'auto'});
}
//<summary>
//
document.addEventListener('DOMContentLoaded', () => {
    // '상품설명' 버튼
    const infoBtnClick = document.querySelector('.Category-Nav-btn:nth-child(1)');
    // '상세정보' 버튼
    const detailsBtnClick = document.querySelector('.Category-Nav-btn:nth-child(2)');

    /*
    // '상품설명' 버튼 클릭 시
    infoBtnClick.addEventListener('click', () => {
        OnScrollSection('product-info');
    });

    // '상세정보' 버튼 클릭 시
    detailsBtnClick.addEventListener('click', () => {
        OnScrollSection('more-details');
    });*/
});
document.addEventListener("DOMContentLoaded", () => {
    // 로컬스토리지에서 제품 정보를 읽어옴
    const productDetails = JSON.parse(localStorage.getItem("selectedProduct"));
    
    if (productDetails) {
        renderProductDetails(productDetails);
    } else {
        console.error("No product details found in localStorage.");
    }
});

function renderProductDetails(product) {
    document.getElementById("ProductImage").src = `../img/TextImage/${product.image}`;
    document.getElementById("ProductName").textContent = product.title;
    document.getElementById("ProductDiscountPercent").textContent = `할인율: ${product.sale}%`;
    document.getElementById("ProductDiscountedPrice").textContent = `가격: ${formatPrice(product.price - (product.price * (product.sale / 100)))}원`;
    document.getElementById("ProductOriginalPrice").textContent = `할인전 가격: ${formatPrice(product.price)}원`;
    document.getElementById("ProductOrigin").textContent = `원산지: ${product.origin || "알 수 없음"}`;
}

function formatPrice(price) {
    return price.toLocaleString("ko-KR");
}