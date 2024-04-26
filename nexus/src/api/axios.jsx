import axios from "axios";
import {PathConstants} from "../constants/PathConstants.js";
import {JwtConstants} from "../constants/JwtConstats.js";

const token = localStorage.getItem(JwtConstants.KEY)

export const auth = axios.create({
    baseURL: PathConstants.AUTH
});

export const admin = axios.create({
    baseURL: PathConstants.ADMIN,
    headers: {
        'Authorization': JwtConstants.BEARER + token
    }
});

export const product = axios.create({
    baseURL: PathConstants.PRODUCT
});

export const profile = axios.create({
    baseURL: PathConstants.PROFILE,
    headers: {
        'Authorization': JwtConstants.BEARER + token
    }
});

export const sale = axios.create({
    baseURL: PathConstants.SALE,
    headers: {
        'Authorization': JwtConstants.BEARER + token
    }
})