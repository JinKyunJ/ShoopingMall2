/* 
 클래스로 제품을 추가할때마다 생성하고 랜더링하는 역할을 합니다.
 제품의 디자인이나 틀은 항상 유지되고있고 공통적으로 합치는데 있어 불필요한코드가 너무 많아 나눠서 작업합니다.
*/

class ProductComponent
{
    constructor(containerId,productData) //컨테이너 id 제품 데이터를 받아서 클래스의 속성으로 저장
    {
        this.containerId = containerId;
        this.productData = productData;
        this.render(); //컴포넌트를 렌더링 합니다.
    }
}