/// <reference types="axios" />
import { AxiosStatic } from "axios";

declare var axios: AxiosStatic;
interface Window {
    axios: AxiosStatic;
}
