const {Category} = require('../models');

class CategoryService {
    // create
    async createCategory(query){
        const category = await Category.findOne(query);
        if(category){
            const result = {
                result : "fail",
                reason : "이미 생성된 카테고리입니다."
            }
            return result;
        } else {
            const result = await Category.create(query);
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
    async findCategory({__id}) {
        const category = await Category.findOne({__id});
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
    async findUpdate({__id}, query){
        const category = await Category.findOne({__id});
        if(!category){
            const result = {
                result : "fail",
                reason : "조회된 카테고리가 없습니다."
            };
            return result;
        } else {
            await Category.updateOne(category, query);
            const result = {
                result : "ok"
            };
            return result;
        }
    }
    // find and delete
    async findDelete({__id}) {
        const category = await Category.findOne({__id});
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