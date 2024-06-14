const {Category} = require('../models');

class CategoryService {
    // create (bodyData : name)
    async createCategory(bodyData){
        const category = await Category.findOne(bodyData);
        if(category){
            throw new Error("이미 생성된 카테고리입니다.")
        } else {
            return await Category.create(bodyData);
        }
    }

    // find all
    async findAllCategory(){
        const categories = await Category.find();
        if(categories.length === 0){
            throw new Error("조회된 카테고리가 없습니다.");
        }
        return categories;
    }

    // findOne
    async findById({nanoid}) {
        const category = await Category.findOne({nanoid});
        if(!category){
            throw new Error("조회된 카테고리가 없습니다.");
        }
        return category;
    }

    // update (bodyData : name)
    async updateById({nanoid}, bodyData){
        const category = await Category.findOne({nanoid});
        if(!category){
            throw new Error("조회된 카테고리가 없습니다.");
        } else {
            await Category.updateOne(category, bodyData);
            return `${nanoid} 카테고리 수정 동작 완료`;
        }
    }

    // delete
    async deleteById({nanoid}) {
        const category = await Category.findOne({nanoid});
        if(!category){
           throw new Error("조회된 카테고리가 없습니다.");
        } else {
            await Category.deleteOne(category);
            return `${nanoid} 카테고리 삭제 동작 완료`;
        }
    }
}

const categoryService = new CategoryService();
module.exports = categoryService;