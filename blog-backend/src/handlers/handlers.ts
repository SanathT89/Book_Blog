import { GraphQLList,GraphQLObjectType,GraphQLSchema,GraphQLNonNull,GraphQLString,GraphQLID} from "graphql";
import { BlogType, CommentType, UserType } from "../schema/schema";
import User from "../models/User";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import { Document, startSession} from "mongoose";
import {hashSync,compareSync} from 'bcryptjs';

type DocumentType = Document<any,any,any>

const RootQuery =new GraphQLObjectType({
    name:"RootQuery",
    fields:{
        //get all users
        users:{
            type: GraphQLList(UserType),
            async resolve() {
                return await User.find();
            },
        },

         // get user by id
        user: {
            type: UserType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            async resolve(parent, { id }) {
            return User.findById(id).populate("blogs");
            },
        },

        //get all blogs
        blogs:{
            type: GraphQLList(BlogType),
            async resolve(){
                return await Blog.find();
            },
        }, 

        // get blog by id
        blog: {
            type: BlogType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            async resolve(parent, { id }) {
            return await Blog.findById(id).populate("user comments");
            },
        },

        //get all comments
        comments:{
            type: GraphQLList(CommentType),
            async resolve(){
                return await Comment.find();
            },
        },
    },
});

const mutations = new GraphQLObjectType({
    name:"mutations",
    fields:{
        //user signup
        signup:{
            type:UserType,
            args:{
                name:{type: GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                password:{type:GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{ name, email, password }){
                //validation to check if user is already there
                let exisitngUser: Document<any,any,any>;
                try{
                    exisitngUser=await User.findOne({email});
                    if(exisitngUser) return new Error("User Already Exists");
                    const encryptedPassword = hashSync(password); //sychronously generates a hash of any string
                    const user = new User({name,email,password:encryptedPassword });
                    return await user.save(); 
                }   catch(err){
                    return new Error("User Signup Failed. Try Again! ");
                }
            },
        },
        //user login
        login:{
            type:UserType,
            args:{
                email: {type: GraphQLNonNull(GraphQLString)},
                password: { type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{email,password}) {
                let exisitngUser: Document<any,any,any>;
                try{
                    exisitngUser= await User.findOne({email});
                    if(!exisitngUser) 
                        return new Error("No User Registered With This Email");

                    //decrypting password
                    const decryptedPassword=compareSync(
                        password,
                        //@ts-ignore
                        exisitngUser?.password//? indicates optional check andtsignore ignores the type checking
                        );
                        if(!decryptedPassword) return new Error("Incorrect Password");
                        return exisitngUser;

                }catch(err){
                    return new Error(err);
                }
            }
        },
        //create blog
        addBlog:{
            type:BlogType,
            args:{
                title:{type:GraphQLNonNull(GraphQLString)},
                content:{type:GraphQLNonNull(GraphQLString)},
                date:{type:GraphQLNonNull(GraphQLString)},
                user:{type:GraphQLNonNull(GraphQLID),}
            },
            async resolve(parent,{title,content,date,user}){
                let blog:Document<any,any,any>;
                const session = await startSession();
                try{
                    session.startTransaction({session});
                    blog=new Blog({title,content,date,user});
                    const exisitngUser=await User.findById(user);
                    if(!exisitngUser) return new Error("User Not Found! Exiting");
                    exisitngUser.blogs.push(blog);
                    await exisitngUser.save({session});
                    return await blog.save({session});
                }catch(err){
                    return new Error(err);
                }
                finally{
                    await session.commitTransaction();
                }
            }
        },
        //updateblog 
        updateBlog:{
            type:BlogType,
            args:{
                id:{type: GraphQLNonNull(GraphQLID)},
                title:{ type:GraphQLNonNull(GraphQLString)},
                content:{ type:GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{id, title, content,user}){
                let exisitngBlog:DocumentType
                try{
                    exisitngBlog = await Blog.findById(id);
                    if(!exisitngBlog) return new Error("Blog does exist")
                    return await Blog.findByIdAndUpdate(id,{
                        title,
                        content,
                    },{ new: true } );
                }catch(err){
                    return new Error(err);
                }
            },
        },
        //delete blog 
        deleteBlog:{
            type: BlogType,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent,{id}){
                let exisitngBlog:DocumentType
                const session =await startSession();

                try{ 
                    session.startTransaction({session});                   
                    exisitngBlog = await Blog.findById(id).populate("user");
                    //@ts-ignore
                    const existingUSer=exisitngBlog?.user;
                    if(!existingUSer) return new Error("No User Linked To This Blog")

                    if(!exisitngBlog) return new Error("No Blog Found");
                    existingUSer.blogs.pull(exisitngBlog);
                    await existingUSer.save({session});
                    return await exisitngBlog.deleteOne({id: exisitngBlog.id});
                }catch(err){
                    return new Error(err);
                }finally{
                    session.commitTransaction();
                }                 
            }
        },
        //add comment to blog
        addCommentToBlog:{
            type:CommentType,
            args:{
                blog:{type:GraphQLNonNull(GraphQLID)},
                user:{type:GraphQLNonNull(GraphQLID)},
                text:{type:GraphQLNonNull(GraphQLString)},
                date:{type:GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{user,blog,text,date}){
                const session = await startSession();
                let comment:DocumentType;
                try{
                    session.startTransaction({session});
                    const exisitngUser=await User.findById(user);
                    const exisitngBlog=await Blog.findById(blog)
                    if(!exisitngBlog || !exisitngUser)
                        return new Error("User Or Blog Does Not Exist");
                    comment = new Comment({
                        text,
                        date,
                        blog,
                        user,
                    });
                    exisitngUser.comments.push(comment);
                    exisitngBlog.comments.push(comment);
                    await exisitngBlog.save({session});
                    await exisitngUser.save({session});
                    return await comment.save({session});
                }catch(err){
                    return new Error (err);
                }finally{
                    await session.commitTransaction();
                }
            },
        },
        //delete a comment
        deleteComment:{
            type:CommentType,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent,{id}){
                let comment: DocumentType;
                const session =await startSession();
                try{
                    session.startTransaction({session});
                    comment = await Comment.findById(id);
                    if(!comment) return new Error("Comment Not Found");
                    //@ts-ignore
                    const exisitngUser=await User.findById(comment?.user);
                    if(!exisitngUser) return new Error("User Not Found");
                    //@ts-ignore
                    const exisitngBlog=await Blog.findById(comment?.blog);
                    if(!exisitngBlog) return new Error("Blog not found");
                    exisitngUser.comments.pull(comment);
                    exisitngBlog.comments.pull(comment);
                    await exisitngUser.save({session})
                    await exisitngBlog.save({session})
                    return await comment.deleteOne({ id: comment.id });//as remove()is depreciated
                }catch(err){
                    return new Error(err)
                }finally{
                    await session.commitTransaction();
                }
            }
        }
    },
});

export default new GraphQLSchema({query: RootQuery, mutation: mutations});