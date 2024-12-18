import { Article } from "../models/article.model";
import Category from "../models/category.model";

export const resolversArticle = {
    Query: {
        getListArticle: async (_, args) => {
            const {
                sortKey,
                sortValue,
                currentPage,
                limitItems,
                filterKey,
                filterValue
            } = args;

            const find = {
                deleted: false
            };

            // Sort
            const sort = {};
            if (sortKey && sortValue) {
                sort[sortKey] = sortValue;
            }
            // End sort

            // Pagination 
            const skip = (currentPage - 1) * limitItems;
            // End pagination

            // Filter 
            if(filterKey && filterValue) {
                find[filterKey] = filterValue;
            }
            // End filter 

            const articles = await Article
                .find(find)
                .sort(sort)
                .limit(limitItems)
                .skip(skip);

            return articles;
        },

        getArticle: async (_, args) => {
            const { id } = args;

            const article = await Article.findOne({
                _id: id,
                deleted: false
            });
            return article;
        }
    },

    Mutation: {
        createArticle: async (_, args) => {
            const { article } = args;

            const record = new Article(article);
            await record.save();

            return record;
        },

        deleteArticle: async (_, args) => {
            const { id } = args;

            await Article.updateOne({
                _id: id,
                deleted: false
            }, {
                deleted: true
            });

            return {
                code: "success",
                message: "Delete successfully!"
            }
        },

        updateArticle: async (_, args) => {
            const { id, article } = args;

            await Article.updateOne({
                _id: id,
                deleted: false
            }, article);

            const record = await Article.findOne({
                _id: id,
                deleted: false
            });

            return record;
        }
    },

    Article: {
        category: async (record) => {
            const categoryId = record.categoryId;

            const category = await Category.findOne({
                _id: categoryId,
                deleted: false
            });

            return category;
        }
    }

};