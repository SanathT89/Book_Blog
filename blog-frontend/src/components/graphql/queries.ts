import {gql} from '@apollo/client'
export const GET_BLOGS = gql`
{
    blogs{
        id 
        title
        date
        content
        user{
            name
        }
    }
}
`;

export const GET_USER_BLOGS = gql`
  query user($id: ID!) {
    user(id: $id) {
      blogs {
        id
        title
        content
        date
      }
    }
  }
`;

export const GET_BLOG_BY_ID = gql`
  query blog($id: ID!) {
    blog(id: $id) {
      title
      id
      content
      date
      user {
        name
        email
      }
      comments {
        id
        text
        user {
          name
          id
        }
      }
    }
  }
`;