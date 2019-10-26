/// <reference types="axios" />
import { AxiosStatic } from "axios";

declare const axios: AxiosStatic;
interface Window {
    axios: AxiosStatic;
}
