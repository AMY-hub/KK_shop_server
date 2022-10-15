const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    lastname: {type: DataTypes.STRING, allowNull: true},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    age: {type: DataTypes.INTEGER, allowNull: true},
    skin: {type: DataTypes.STRING, allowNull: true},
});

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const FavList = sequelize.define('fav_list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const FavProduct = sequelize.define('fav_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    address: {type: DataTypes.STRING, allowNull: false},
    shipping_method: {type: DataTypes.STRING, allowNull: false},
    status: {type: DataTypes.STRING, defaultValue: 'created'}
});

const OrderProduct = sequelize.define('order_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, defaultValue: 1}
});

const BonusCard = sequelize.define('bonus_card', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.BIGINT, unique: true},
    points: {type: DataTypes.INTEGER, defaultValue: 0}
});

const Review = sequelize.define('review', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING, allowNull: false}
});

const SpecialSale = sequelize.define('special_sale', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    discount: {type: DataTypes.INTEGER, allowNull: false, validate: {
        min: 1,
        max: 99
    }}
});

const SaleProduct = sequelize.define('sale_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    name_rus: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    old_price: {type: DataTypes.INTEGER, allowNull: true},
    img: {type: DataTypes.STRING, allowNull: false},
    weight: {type: DataTypes.STRING, allowNull: false},
    volume: {type: DataTypes.STRING, allowNull: false},
});

const ProductInfo = sequelize.define('product_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT}
});

const ProductAddImage = sequelize.define('product_add_image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    img: {type: DataTypes.STRING}
});

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
});

const Country = sequelize.define('country', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
});

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
});

const SubCategory = sequelize.define('sub_category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
});

const CategoryBrand = sequelize.define('category_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const SubCategoryBrand = sequelize.define('sub_category_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const CategoryCountry = sequelize.define('category_country', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const SubCategoryCountry = sequelize.define('sub_category_country', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasOne(FavList);
FavList.belongsTo(User);

User.hasMany(Order, {as: 'orders'});
Order.belongsTo(User);

Order.hasMany(OrderProduct, {as: 'products'});
OrderProduct.belongsTo(Order);

Basket.hasMany(BasketProduct, {as: 'products'});
BasketProduct.belongsTo(Basket);

FavList.hasMany(FavProduct, {as: 'favs'});
FavProduct.belongsTo(FavList);

User.hasMany(Review);
Review.belongsTo(User);

User.hasOne(BonusCard);
BonusCard.belongsTo(User);

SpecialSale.hasMany(SaleProduct, {as: 'products'});
SaleProduct.belongsTo(SpecialSale);

Brand.hasMany(Product);
Product.belongsTo(Brand);

Country.hasMany(Product);
Product.belongsTo(Country);

Country.hasMany(Brand);
Brand.belongsTo(Country);

Category.hasMany(Product);
Product.belongsTo(Category);

Category.hasMany(SubCategory, {as: 'subcategories'});
SubCategory.belongsTo(Category);

SubCategory.hasMany(Product);
Product.belongsTo(SubCategory);

Product.hasMany(Review, {as: 'reviews'});
Review.belongsTo(Product);

Product.hasMany(ProductInfo, {as: 'info'});
ProductInfo.belongsTo(Product);

Product.hasMany(ProductAddImage, {as: 'product_add_images'});
ProductAddImage.belongsTo(Product);

Category.belongsToMany(Brand, {through: CategoryBrand});
Brand.belongsToMany(Category, {through: CategoryBrand});

SubCategory.belongsToMany(Brand, {through: SubCategoryBrand});
Brand.belongsToMany(SubCategory, {through: SubCategoryBrand});

Category.belongsToMany(Country, {through: CategoryCountry});
Country.belongsToMany(Category, {through: CategoryCountry});

SubCategory.belongsToMany(Country, {through: SubCategoryCountry});
Country.belongsToMany(SubCategory, {through: SubCategoryCountry});

module.exports = {
    User,
    Basket,
    FavList,
    Order,
    BasketProduct,
    FavProduct,
    OrderProduct,
    BonusCard,
    Review,
    SpecialSale,
    SaleProduct,
    Product,
    ProductInfo,
    ProductAddImage,
    Category,
    SubCategory,
    Brand,
    Country,
    CategoryBrand,
    SubCategoryBrand,
    CategoryCountry,
    SubCategoryCountry
};
