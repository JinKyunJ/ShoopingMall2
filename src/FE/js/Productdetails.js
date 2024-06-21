// Productdetails.js

document.addEventListener("DOMContentLoaded", () => {
    // 로컬스토리지에서 제품 정보를 읽어옴
    const productDetails = JSON.parse(localStorage.getItem("selectedProduct"));

    if (productDetails) {
        renderProductDetails(productDetails); // 제품 정보 출력
    } else {
        console.error("No product details found in localStorage.");
    }
});

function renderProductDetails(product) {
    console.log(product);
    // 기본 제품 정보 출력
    document.getElementById("ProductImage").src = `../img/TextImage/${product.image}`;
    document.getElementById("ProductName").textContent = product.title;
    document.getElementById("ProductDiscountPercent").textContent = `할인율: ${product.sale}%`;
    document.getElementById("ProductDiscountedPrice").textContent = `가격: ${formatPrice(product.price - (product.price * (product.sale / 100)))}원`;
    document.getElementById("ProductOriginalPrice").textContent = `할인전 가격: ${formatPrice(product.price)}원`;
    document.getElementById("ProductOrigin").textContent = `원산지: ${product.origin || "알 수 없음"}`;

    // 상세 이미지 출력
    const detailImagesContainer = document.getElementById("product-details");

    if (detailImagesContainer) {
        // 컨테이너 초기화
        detailImagesContainer.innerHTML = "";

        if (product.detailImages && Array.isArray(product.detailImages) && product.detailImages.length > 0) {
            product.detailImages.forEach(imageName => {
                const img = document.createElement('img');
                img.src = `../img/TextImage/${imageName}`;
                img.alt = '상품 상세 이미지';
                img.className = 'Product-DetailImage';
                detailImagesContainer.appendChild(img);
            });
        } else {
            detailImagesContainer.textContent = "상세 이미지가 없습니다.";
        }
    } else {
        console.error("Detail images container not found.");
    }

    // 상품 후기 출력
    const reviewsContainer = document.getElementById("product-reviews");

    if (reviewsContainer) {
        // 컨테이너 초기화
        reviewsContainer.innerHTML = "";

        if (product.comments && Array.isArray(product.comments) && product.comments.length > 0) {
            product.comments.forEach(comment => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';

                const reviewContent = document.createElement('p');
                reviewContent.textContent = comment.content;
                reviewContent.className = 'review-content';

                const reviewDate = document.createElement('p');
                reviewDate.textContent = `작성일자: ${new Date(comment.createdAt).toLocaleDateString("ko-KR")}`;
                reviewDate.className = 'review-date';

                reviewElement.appendChild(reviewContent);
                reviewElement.appendChild(reviewDate);

                reviewsContainer.appendChild(reviewElement);
            });
        } else {
            reviewsContainer.textContent = "후기가 없습니다.";
        }
    } else {
        console.error("Reviews container not found.");
    }
}

// 가격을 포맷팅하는 함수
function formatPrice(price) {
    return price.toLocaleString("ko-KR");
}
