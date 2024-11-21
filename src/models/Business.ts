import { Service } from "./Service";

export interface Business {
    id:string;
    name:string;
    description:string;
    address:string;
    city:string;
    state:string;
    zipcode:string;
    phone:string;
    email:string;
    services: Service[];

}
