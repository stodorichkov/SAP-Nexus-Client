export const RegexConstants = {
    USERNAME_REGEX: /^[a-zA-Z0-9_.-]{3,50}$/,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    NAME_REGEX: /^[A-Z][a-z]{2,30}$/,
    PRODUCT_NAME_REGEX: /^[a-zA-Z0-9\s]{2,50}$/,
    PRODUCT_BRAND_REGEX: /^[a-zA-Z0-9\s]{2,30}$/
}