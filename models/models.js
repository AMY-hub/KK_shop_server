const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    lastname: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    birthdate: {type: DataTypes.DATE, allowNull: true},
});

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refresh_token: {type: DataTypes.STRING, allowNull: false}
});

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    temporary_key: {type: DataTypes.STRING, allowNull: true, unique: true},
});

const FavList = sequelize.define('fav_list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, defaultValue: 1, allowNull: false}
});

const FavProduct = sequelize.define('fav_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    address: {type: DataTypes.STRING, allowNull: false},
    shipping_method: {type: DataTypes.STRING, allowNull: false},
    status: {type: DataTypes.STRING, defaultValue: 'Принят'},
    payment_status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'Не оплачен'},
    payment: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
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

const ShopAddress = sequelize.define('shop_address', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING, defaultValue: 'shop'},
    address: {type: DataTypes.STRING, allowNull: false, unique: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false, unique: true},
    coord: {type: DataTypes.ARRAY(DataTypes.DECIMAL), allowNull: false, unique: true},
});

const SpecialSale = sequelize.define('special_sale', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    discount: {type: DataTypes.INTEGER, allowNull: false, validate: {
        min: 1,
        max: 99
    }}
});

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    name_rus: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    weight: {type: DataTypes.STRING, allowNull: false},
    volume: {type: DataTypes.STRING, allowNull: false},
    orderQuantity: {type: DataTypes.INTEGER, defaultValue: 0},
    art: {type: DataTypes.STRING(10), unique: true, allowNull: false} 
});

const Certificate = sequelize.define('certificate', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
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

const PromoCode = sequelize.define('promocode', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    discount: {type: DataTypes.INTEGER, allowNull: false, validate: {
        min: 1,
        max: 99
    }}
});

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.TEXT},
    route: {type: DataTypes.STRING, unique: true, allowNull: false}
});

const Country = sequelize.define('country', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    route: {type: DataTypes.STRING, unique: true, allowNull: false}
});

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    route: {type: DataTypes.STRING, unique: true, allowNull: false}
});

const SubCategory = sequelize.define('sub_category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    route: {type: DataTypes.STRING, unique: true, allowNull: false}
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

const Subscriber = sequelize.define('subscriber', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false}
});

User.hasOne(Token, {onDelete: 'CASCADE'});
Token.belongsTo(User);

User.hasOne(Basket, {onDelete: 'CASCADE'});
Basket.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

User.hasOne(BonusCard, {onDelete: 'CASCADE'});
BonusCard.belongsTo(User);

User.hasOne(FavList, {onDelete: 'CASCADE'});
FavList.belongsTo(User);

User.hasMany(Order, {as: 'orders', onDelete: 'CASCADE'});
Order.belongsTo(User);

Order.hasMany(OrderProduct, {as: 'products', onDelete: 'CASCADE'});
OrderProduct.belongsTo(Order);

Basket.hasMany(BasketProduct, {as: 'products', onDelete: 'CASCADE'});
BasketProduct.belongsTo(Basket);

FavList.hasMany(FavProduct, {as: 'favs', onDelete: 'CASCADE'});
FavProduct.belongsTo(FavList);

Product.hasMany(BasketProduct, {onDelete: 'CASCADE'});
BasketProduct.belongsTo(Product);

Product.hasMany(FavProduct, {onDelete: 'CASCADE'});
FavProduct.belongsTo(Product);

SpecialSale.hasMany(Brand, {as: 'brands'});
Brand.belongsTo(SpecialSale);

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

Product.hasMany(Review, {as: 'reviews', onDelete: 'CASCADE'});
Review.belongsTo(Product);

Product.hasMany(ProductInfo, {as: 'info', onDelete: 'CASCADE'});
ProductInfo.belongsTo(Product);

Product.hasMany(ProductAddImage, {as: 'product_add_images', onDelete: 'CASCADE'});
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
    Token,
    Basket,
    FavList,
    Order,
    BasketProduct,
    FavProduct,
    OrderProduct,
    BonusCard,
    Review,
    SpecialSale,
    Product,
    ProductInfo,
    ProductAddImage,
    Category,
    SubCategory,
    Brand,
    Country,
    Subscriber,
    Certificate,
    PromoCode,
    ShopAddress
};
