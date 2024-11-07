import Category from "./category";
import Comment from "./comment";
import Post from "./post";
import User from "./user";


// Post belongs to User
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Post has many Categories (many-to-many)
Post.belongsToMany(Category, { through: 'PostCategories', as: 'categories' });
Category.belongsToMany(Post, { through: 'PostCategories', as: 'posts' });

// Post has many Comments
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// Comment belongs to User
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });