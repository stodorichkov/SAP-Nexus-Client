import axios from "axios";
import {PathConstants} from "../conastants/PathConstants.js";
import {JwtConstants} from "../conastants/JwtConstats.js";

const token = localStorage.getItem(JwtConstants.KEY)

export const auth = axios.create({
    baseURL: PathConstants.AUTH
});

export const profile = axios.create({
    baseURL: PathConstants.PROFILE,
    headers: {
        'Authorization': JwtConstants.BEARER + token
    }
});