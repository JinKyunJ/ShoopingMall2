const {Category} = require('../models');

class CategoryService {
    // create
    async createCategory(bodyData){
        const category = await Category.findOne(bodyData);
        if(category){
            const result = {
                result : "fail",
                reason : "이미 생성된 카테고리입니다."
            }
            return result;
        } else {
            const result = await Category.create(bodyData);
            console.log(result);
            return result;
        }
    }

    // find
    async findAllCategory(){
        const categories = await Category.find();
        if(categories.length === 0){
            const result = {
                result : "fail",
                reason : "조회된 카테고리가 없습니다."
            };
            return result;
        }
        return categories;
    }
    // findOne
    async findById({nanoid}) {
        const category = await Category.findOne({nanoid});
        if(!category){
            const result = {
                result : "fail",
                reason : "조회된 카테고리가 없습니다."
            };
            return result;
        }
        return category;
    }
    // find and update
    async updateById({nanoid}, bodyData){
        const category = await Category.findOne({nanoid});
        if(!category){
            const result = {
                result : "fail",
                reason : "조회된 카테고리가 없습니다."
            };
            return result;
        } else {
            await Category.updateOne(category, bodyData);
            const result = {
                result : "ok"
            };
            return result;
        }
    }
    // find and delete
    async deleteById({nanoid}) {
        const category = await Category.findOne({nanoid});
        if(!category){
            const result = {
                result : "fail",
                reason : "조회된 카테고리가 없습니다."
            };
            return result;
        } else {
            await Category.deleteOne(category);
            const result = {
                result : "ok"
            };
            return result;
        }
    }
}

const categoryService = new CategoryService();
module.exports = categoryService;