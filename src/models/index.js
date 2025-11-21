import { Sequelize } from "sequelize";
import config from "../config/config.js";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const models = {};

try {
  await sequelize.authenticate();

  const ProductModule = await import("./products.js");
  models.Product = ProductModule.default(sequelize, Sequelize.DataTypes);

  const ProductVariantModule = await import("./productVariants.js");
  models.ProductVariant = ProductVariantModule.default(sequelize, Sequelize.DataTypes);

  const CategoryModule = await import("./categories.js");
  models.Category = CategoryModule.default(sequelize, Sequelize.DataTypes);

  const UserModule = await import("./user.js");
  models.User = UserModule.default(sequelize, Sequelize.DataTypes);

  const OrderModule = await import("./orders.js");
  models.Order = OrderModule.default(sequelize, Sequelize.DataTypes);

  const OrderItemModule = await import("./orderItems.js");
  models.OrderItem = OrderItemModule.default(sequelize, Sequelize.DataTypes);

  const RoleModule = await import("./role.js");
  models.Role = RoleModule.default(sequelize, Sequelize.DataTypes);

  const GroupModule = await import("./group.js");
  models.Group = GroupModule.default(sequelize, Sequelize.DataTypes);

  const GroupRoleModule = await import("./groupRole.js");
  models.GroupRole = GroupRoleModule.default(sequelize, Sequelize.DataTypes);

  const CartModule = await import("./cart.js");
  models.Cart = CartModule.default(sequelize, Sequelize.DataTypes);

  const CartItemModule = await import("./cartItem.js");
  models.CartItem = CartItemModule.default(sequelize, Sequelize.DataTypes);

} catch (error) {
  console.error('Error initializing models:', error);
  process.exit(1);
}

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

try {
  await sequelize.sync({
    force: false,
    alter: true,
  });
} catch (error) {
  console.error('Database sync error:', error);
}

const db = {
  ...models,
  sequelize,
  Sequelize
};

export default db;