import axios from "axios";
import {PathConstants} from "../conastants/PathConstants.js";

export const auth = axios.create({
    baseURL: PathConstants.AUTH
});