import { Request, Response } from 'express';
import User from '../src/models/user';
import Post from '../src/models/post';
import CONSTANTS from '../src/config/constants';
import { addCategoryToPost, addCommentToPost, createPost, deletePost, getPost, getPostCategories, getPostComments, getPosts, updatePost } from '../src/controllers/post';
import Category from '../src/models/category';
import Comment from '../src/models/comment';

const mockRequest = () => ({ body: {}, params: {}, query: {} } as unknown as Request);
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

describe('createPost', () => {
    it('should create a post when user exists', async () => {
      const req = mockRequest();
      req.body = { title: 'Test Post', content: 'Content of the post', userId: 1 };
      const res = mockResponse();
  
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(Post, 'create').mockResolvedValueOnce({ id: 1, ...req.body } as any);
  
      await createPost(req, res);
  
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(Post.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  
    it('should return 404 if user does not exist', async () => {
      const req = mockRequest();
      req.body = { title: 'Test Post', content: 'Content of the post', userId: 1 };
      const res = mockResponse();
  
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);
  
      await createPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: CONSTANTS.USER_NOT_FOUND, name: 'userId' });
    });
});

describe('getPosts', () => {
    it('should return paginated list of posts', async () => {
      const req = mockRequest();
      req.query = { page: '1', pageSize: '10' };
      const res = mockResponse();
  
      const mockResult = {
        rows: [{ id: 1, title: 'Post 1' }],
        count: 1,
      };
      jest.spyOn(Post, 'findAndCountAll').mockResolvedValueOnce(mockResult as any);
  
      await getPosts(req, res);
  
      expect(Post.findAndCountAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
});


describe('getPost', () => {
    it('should return post by ID', async () => {
      const req = mockRequest();
      req.params.id = '1';
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce({ id: 1, title: 'Post 1' } as any);
  
      await getPost(req, res);
  
      expect(Post.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 404 if post not found', async () => {
      const req = mockRequest();
      req.params.id = '9999';
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(null);
  
      await getPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
    });
});

describe('updatePost', () => {
    it('should update an existing post', async () => {
      const req = mockRequest();
      req.params.id = '1';
      req.body = { title: 'Updated Title', content: 'Updated Content' };
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(Post, 'update').mockResolvedValueOnce([1]);
  
      await updatePost(req, res);
  
      expect(Post.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 404 if post does not exist', async () => {
      const req = mockRequest();
      req.params.id = '9999';
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(null);
  
      await updatePost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
    });
});


describe('deletePost', () => {
    it('should delete a post by ID', async () => {
      const req = mockRequest();
      req.params.id = '1';
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(Post, 'destroy').mockResolvedValueOnce(1);
  
      await deletePost(req, res);
  
      expect(Post.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 404 if post not found', async () => {
      const req = mockRequest();
      req.params.id = '9999';
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(null);
  
      await deletePost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
    });
});

describe('addCategoryToPost', () => {
    it('should add category to post', async () => {
      const req = mockRequest();
      req.params.id = '1';
      req.body = { name: 'Category1' };
      const res = mockResponse();
  
      const mockPost = { id: 1 } as any;
      const mockCategory = { id: 1, addPost: jest.fn() };
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(mockPost);
      jest.spyOn(Category, 'findOrCreate').mockResolvedValueOnce([mockCategory as any, false]);
  
      await addCategoryToPost(req, res);
  
      expect(Post.findByPk).toHaveBeenCalledWith(1);
      expect(Category.findOrCreate).toHaveBeenCalledWith({ where: { name: 'Category1' } });
      expect(mockCategory.addPost).toHaveBeenCalledWith(mockPost);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  
    it('should return 404 if post not found', async () => {
      const req = mockRequest();
      req.params.id = '9999';
      req.body = { name: 'Category1' };
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(null);
  
      await addCategoryToPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: CONSTANTS.POST_NOT_FOUND,
        name: 'Id'
      });
    });
  });
  
  
  
describe('getPostCategories', () => {
    it('should return categories for a post', async () => {
      const req = mockRequest();
      req.params.id = '1';
      const res = mockResponse();
  
      const mockPost = {
        id: 1,
        dataValues: { categories: [{ id: 1, name: 'Category1' }] }
      };
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(mockPost as any);
  
      await getPostCategories(req, res);
  
      expect(Post.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPost.dataValues.categories);
    });
  
    it('should return 404 if post not found', async () => {
      const req = mockRequest();
      req.params.id = '9999';
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(null);
  
      await getPostCategories(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: CONSTANTS.POST_NOT_FOUND,
        name: 'Id'
      });
    });
});

describe('addCommentToPost', () => {
    it('should add a comment to a post when post and user exist', async () => {
      const req = mockRequest();
      req.params.id = '1';
      req.body = { content: 'Nice post!', userId: 1 };
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(Comment, 'create').mockResolvedValueOnce({ id: 1, ...req.body } as any);
  
      await addCommentToPost(req, res);
  
      expect(Post.findByPk).toHaveBeenCalledWith(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(Comment.create).toHaveBeenCalledWith({
        content: 'Nice post!',
        postId: 1,
        userId: 1
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  
    it('should return 404 if post not found', async () => {
      const req = mockRequest();
      req.params.id = '9999';
      req.body = { content: 'Nice post!', userId: 1 };
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(null);
  
      await addCommentToPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: CONSTANTS.POST_NOT_FOUND,
        name: 'Id'
      });
    });
  
    it('should return 404 if user not found', async () => {
      const req = mockRequest();
      req.params.id = '1';
      req.body = { content: 'Nice post!', userId: 9999 };
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);
  
      await addCommentToPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: CONSTANTS.USER_NOT_FOUND,
        name: 'userId'
      });
    });
});


describe('getPostComments', () => {
    it('should return comments for a post', async () => {
      const req = mockRequest();
      req.params.id = '1';
      const res = mockResponse();
  
      const mockPost = {
        id: 1,
        dataValues: {
          comments: [
            {
              id: 1,
              content: 'Nice post!',
              author: { id: 1, username: 'User1' }
            }
          ]
        }
      };
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(mockPost as any);
  
      await getPostComments(req, res);
  
      expect(Post.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPost.dataValues.comments);
    });
  
    it('should return 404 if post not found', async () => {
      const req = mockRequest();
      req.params.id = '9999';
      const res = mockResponse();
  
      jest.spyOn(Post, 'findByPk').mockResolvedValueOnce(null);
  
      await getPostComments(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: CONSTANTS.POST_NOT_FOUND,
        name: 'Id'
      });
    });
  });
  
  
   