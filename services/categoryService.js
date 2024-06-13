const {Category} = require('../models');

class CategoryService {
    // create (bodyData : name)
    async createCategory(bodyData){
        const category = await Category.findOne(bodyData);
        if(category){
            const result = {
                value : "fail",
                data : "이미 생성된 카테고리입니다."
            }
            return result;
        } else {
            const newCategory = await Category.create(bodyData);
            const result = {
                value : "ok",
                data : newCategory
            };
            return result;
        }
    }

    // find all
    async findAllCategory(){
        const categories = await Category.find();
        if(categories.length === 0){
            const result = {
                value : "fail",
                data : "조회된 카테고리가 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : categories
        };
        return result;
    }
    // findOne
    async findById({nanoid}) {
        const category = await Category.findOne({nanoid});
        if(!category){
            const result = {
                value : "fail",
                data : "조회된 카테고리가 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : category
        };
        return result;
    }
    // update (bodyData : name)
    async updateById({nanoid}, bodyData){
        const category = await Category.findOne({nanoid});
        if(!category){
            const result = {
                value : "fail",
                data : "조회된 카테고리가 없습니다."
            };
            return result;
        } else {
            await Category.updateOne(category, bodyData);
            const result = {
                value : "ok",
                data : `${nanoid} 카테고리 수정 동작 완료`
            };
            return result;
        }
    }
    // delete
    async deleteById({nanoid}) {
        const category = await Category.findOne({nanoid});
        if(!category){
            const result = {
                value : "fail",
                data : "조회된 카테고리가 없습니다."
            };
            return result;
        } else {
            await Category.deleteOne(category);
            const result = {
                value : "ok",
                data : `${nanoid} 카테고리 삭제 동작 완료`
            };
            return result;
        }
    }
}

const categoryService = new CategoryService();
module.exports = categoryService;