import { gql } from "@apollo/client";

export const USER_LOGIN  = gql`
mutation login($email:String!,$password:String!){
    login(email:$email,password: $password){
        id
        email
        name
    }
}
`;

export const USER_SIGNUP = gql`
mutation signup($name:String!,$email:String!,$password:String!){
    signup(name:$name, email:$email,password: $password){
        id
        email
        name
    }
}
`;

export const ADD_BLOG = gql`
  mutation addBlog(
    $title: String!
    $content: String!
    $date: String!
    $user: ID!
  ) {
    addBlog(title: $title, content: $content, date: $date, user: $user) {
      title
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addCommentToBlog(
    $text: String!
    $date: String!
    $user: ID!
    $blog: ID!
  ) {
    addCommentToBlog(text: $text, date: $date, user: $user, blog: $blog) {
      text
      user {
        name
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($id: ID!) {
    deleteComment(id: $id) {
      text
    }
  }
`;

export const UPDATE_BLOG = gql`
  mutation updateBlog($id: ID!, $title: String!, $content: String!) {
    updateBlog(id: $id, title: $title, content: $content) {
      id
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation deleteBlog($id: ID!) {
    deleteBlog(id: $id) {
      id
    }
  }
`;