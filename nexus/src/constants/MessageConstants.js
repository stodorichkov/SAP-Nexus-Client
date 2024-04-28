export const MessageConstants = {
    // registration
    INVALID_USERNAME: 'Username must be between 3 and 50 characters!',
    INVALID_NAME: 'Name must start with capital letter and be between 3 and 30 characters!',
    INVALID_PASSWORD: 'Password must be at least 8 characters long, contain at least one digit,' +
        ' one uppercase letter and one lowercase letter!',
    PASSWORD_MISMATCH: 'Passwords do not match!',
    // profile
    INVALID_TRANSFER: 'Transfer must be positive or zero!',
    // campaign
    INVALID_DISCOUNT: 'Discount must be between 0 and 100!',
    // product
    INVALID_PRODUCT_NAME: 'Name must be between 2 and 50 characters long!',
    INVALID_PRODUCT_BRAND: 'Brand name must be between 2 and 30 characters long!',
    INVALID_MIN_PRICE: 'Min price must be positive or zero!',
    INVALID_PRICE: 'Price must be greater or equal to Min price!',
    INVALID_AVAILABILITY: 'Availability must be positive or zero!',
    FIELD_CANNOT_BE_BLANK: 'Field can not be blank!'
}