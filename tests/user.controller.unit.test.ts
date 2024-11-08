import { GroupedCountResultItem, Model, Op } from 'sequelize'; // Import Model from Sequelize
import CONSTANTS from '../src/config/constants';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../src/controllers/user';
import User from '../src/models/user';
import { NextFunction, Request, Response } from 'express';

// Mock Response, Request, and NextFunction
const mockRequest = (): Partial<Request> => ({ body: {}, params: {}, query: {} });
const mockResponse = (): Partial<Response> => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
// Mock the specific Sequelize model methods
User.findByPk = jest.fn();
User.update = jest.fn();
User.destroy = jest.fn();
User.findOne = jest.fn();
User.findAndCountAll = jest.fn();
const mockNext: NextFunction = jest.fn();

describe('createUser', () => {
  it('should create a new user', async () => {
    const req = mockRequest();
    req.body = { username: 'testuser', email: 'testuser@example.com', password: 'password123' };
    const res = mockResponse();

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(User, 'create').mockResolvedValueOnce({ id: 1, ...req.body });

    await createUser(req as Request, res as Response, mockNext);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { [Op.or]: [{ username: 'testuser' }, { email: 'testuser@example.com' }] }
    });
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ id: 1, ...req.body });
  });

  it('should return 409 if username or email is already used', async () => {
    const req = mockRequest();
    req.body = { username: 'testuser', email: 'testuser@example.com', password: 'password123' };
    const res = mockResponse();

    jest.spyOn(User, 'findOne').mockResolvedValueOnce({ id: 1 } as any);

    await createUser(req as Request, res as Response,  mockNext);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({
      message: CONSTANTS.USERNAME_OR_EMAIL_USED,
      name: 'Conflict'
    });
  });
});


describe('getUsers', () => {
  it('should return a paginated list of users', async () => {
    const req = mockRequest();
    req.query = { page: '1', pageSize: '10' };
    const res = mockResponse();

    const mockResult = {
      rows: [{ id: 1, username: 'testuser' }] as unknown as Model<any, any>[],
      count: 1 // Using a simple number for count
    } as unknown as { rows: Model<any, any>[]; count: number | GroupedCountResultItem[] };

    jest.spyOn(User, 'findAndCountAll').mockResolvedValueOnce(mockResult as any);

    await getUsers(req as Request, res as Response, mockNext);

    expect(User.findAndCountAll).toHaveBeenCalledWith({
      offset: 0,
      limit: 10
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      results: mockResult.rows,
      page: 1,
      pageSize: 10,
      pages: 1,
      totalRecords: 1
    });
  });
});




describe('getUser', () => {
  it('should return a user by ID', async () => {
    const req = mockRequest();
    req.params!.id = '1';
    const res = mockResponse();

    const mockUser = { id: 1, username: 'testuser' } as unknown as Model<any, any>; // Cast to Model instance
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);

    await getUser(req as Request, res as Response, mockNext);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(mockUser);
  });

  it('should return 404 if user not found', async () => {
    const req = mockRequest();
    req.params!.id = '9999';
    const res = mockResponse();

    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);

    await getUser(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: CONSTANTS.USER_NOT_FOUND,
      name: 'Id'
    });
  });
});

describe('deleteUser', () => {
  it('should delete a user by ID', async () => {
    const req = mockRequest();
    req.params!.id = '1';
    const res = mockResponse();

    const mockUser = { id: 1, username: 'testuser' } as unknown as Model<any, any>; // Cast to Model instance
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
    jest.spyOn(User, 'destroy').mockResolvedValueOnce(1);

    await deleteUser(req as Request, res as Response, mockNext);

    expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 404 if user not found', async () => {
    const req = mockRequest();
    req.params!.id = '9999';
    const res = mockResponse();

    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);

    await deleteUser(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: CONSTANTS.USER_NOT_FOUND,
      name: 'Id'
    });
  });
});


describe('updateUser', () => {
  it('should update an existing user', async () => {
    const req = mockRequest();
    req.params!.id = '1';
    req.body = { username: 'updatedUser', email: 'updated@example.com', password: 'newpassword' };
    const res = mockResponse();

    // Mock the behavior of findByPk and update
    (User.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, update: jest.fn() });
    (User.update as jest.Mock).mockResolvedValueOnce([1]);

    await updateUser(req as Request , res as Response, mockNext);

    expect(User.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 404 if user not found', async () => {
    const req = mockRequest();
    req.params!.id = '9999';
    const res = mockResponse();

    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);

    await updateUser(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: CONSTANTS.USER_NOT_FOUND,
      name: 'Id'
    });
  });
});
