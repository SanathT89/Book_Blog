"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema");
const User_1 = __importDefault(require("../models/User"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Comment_1 = __importDefault(require("../models/Comment"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        //get all users
        users: {
            type: (0, graphql_1.GraphQLList)(schema_1.UserType),
            async resolve() {
                return await User_1.default.find();
            },
        },
        // get user by id
        user: {
            type: schema_1.UserType,
            args: { id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) } },
            async resolve(parent, { id }) {
                return User_1.default.findById(id).populate("blogs");
            },
        },
        //get all blogs
        blogs: {
            type: (0, graphql_1.GraphQLList)(schema_1.BlogType),
            async resolve() {
                return await Blog_1.default.find();
            },
        },
        // get blog by id
        blog: {
            type: schema_1.BlogType,
            args: { id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) } },
            async resolve(parent, { id }) {
                return await Blog_1.default.findById(id).populate("user comments");
            },
        },
        //get all comments
        comments: {
            type: (0, graphql_1.GraphQLList)(schema_1.CommentType),
            async resolve() {
                return await Comment_1.default.find();
            },
        },
    },
});
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutations",
    fields: {
        //user signup
        signup: {
            type: schema_1.UserType,
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { name, email, password }) {
                //validation to check if user is already there
                let exisitngUser;
                try {
                    exisitngUser = await User_1.default.findOne({ email });
                    if (exisitngUser)
                        return new Error("User Already Exists");
                    const encryptedPassword = (0, bcryptjs_1.hashSync)(password); //sychronously generates a hash of any string
                    const user = new User_1.default({ name, email, password: encryptedPassword });
                    return await user.save();
                }
                catch (err) {
                    return new Error("User Signup Failed. Try Again! ");
                }
            },
        },
        //user login
        login: {
            type: schema_1.UserType,
            args: {
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { email, password }) {
                let exisitngUser;
                try {
                    exisitngUser = await User_1.default.findOne({ email });
                    if (!exisitngUser)
                        return new Error("No User Registered With This Email");
                    //decrypting password
                    const decryptedPassword = (0, bcryptjs_1.compareSync)(password, 
                    //@ts-ignore
                    exisitngUser?.password //? indicates optional check andtsignore ignores the type checking
                    );
                    if (!decryptedPassword)
                        return new Error("Incorrect Password");
                    return exisitngUser;
                }
                catch (err) {
                    return new Error(err);
                }
            }
        },
        //create blog
        addBlog: {
            type: schema_1.BlogType,
            args: {
                title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                date: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                user: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID), }
            },
            async resolve(parent, { title, content, date, user }) {
                let blog;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    blog = new Blog_1.default({ title, content, date, user });
                    const exisitngUser = await User_1.default.findById(user);
                    if (!exisitngUser)
                        return new Error("User Not Found! Exiting");
                    exisitngUser.blogs.push(blog);
                    await exisitngUser.save({ session });
                    return await blog.save({ session });
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    await session.commitTransaction();
                }
            }
        },
        //updateblog 
        updateBlog: {
            type: schema_1.BlogType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { id, title, content, user }) {
                let exisitngBlog;
                try {
                    exisitngBlog = await Blog_1.default.findById(id);
                    if (!exisitngBlog)
                        return new Error("Blog does exist");
                    return await Blog_1.default.findByIdAndUpdate(id, {
                        title,
                        content,
                    }, { new: true });
                }
                catch (err) {
                    return new Error(err);
                }
            },
        },
        //delete blog 
        deleteBlog: {
            type: schema_1.BlogType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
            },
            async resolve(parent, { id }) {
                let exisitngBlog;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    exisitngBlog = await Blog_1.default.findById(id).populate("user");
                    //@ts-ignore
                    const existingUSer = exisitngBlog?.user;
                    if (!existingUSer)
                        return new Error("No User Linked To This Blog");
                    if (!exisitngBlog)
                        return new Error("No Blog Found");
                    existingUSer.blogs.pull(exisitngBlog);
                    await existingUSer.save({ session });
                    return await exisitngBlog.deleteOne({ id: exisitngBlog.id });
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    session.commitTransaction();
                }
            }
        },
        //add comment to blog
        addCommentToBlog: {
            type: schema_1.CommentType,
            args: {
                blog: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                user: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                text: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                date: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { user, blog, text, date }) {
                const session = await (0, mongoose_1.startSession)();
                let comment;
                try {
                    session.startTransaction({ session });
                    const exisitngUser = await User_1.default.findById(user);
                    const exisitngBlog = await Blog_1.default.findById(blog);
                    if (!exisitngBlog || !exisitngUser)
                        return new Error("User Or Blog Does Not Exist");
                    comment = new Comment_1.default({
                        text,
                        date,
                        blog,
                        user,
                    });
                    exisitngUser.comments.push(comment);
                    exisitngBlog.comments.push(comment);
                    await exisitngBlog.save({ session });
                    await exisitngUser.save({ session });
                    return await comment.save({ session });
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    await session.commitTransaction();
                }
            },
        },
        //delete a comment
        deleteComment: {
            type: schema_1.CommentType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) }
            },
            async resolve(parent, { id }) {
                let comment;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    comment = await Comment_1.default.findById(id);
                    if (!comment)
                        return new Error("Comment Not Found");
                    //@ts-ignore
                    const exisitngUser = await User_1.default.findById(comment?.user);
                    if (!exisitngUser)
                        return new Error("User Not Found");
                    //@ts-ignore
                    const exisitngBlog = await Blog_1.default.findById(comment?.blog);
                    if (!exisitngBlog)
                        return new Error("Blog not found");
                    exisitngUser.comments.pull(comment);
                    exisitngBlog.comments.pull(comment);
                    await exisitngUser.save({ session });
                    await exisitngBlog.save({ session });
                    return await comment.deleteOne({ id: comment.id }); //as remove()is depreciated
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    await session.commitTransaction();
                }
            }
        }
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map