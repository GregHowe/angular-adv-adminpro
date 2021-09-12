//import { environment } from "src/environments/environment"
//const base_url = environment.base_url;

import { Hospital } from "./hospital.model";

interface _MedicoUSer{
    _id: string,
    nombre: string,
    img: string,
}

export class Medico{

/**
 *
 */
constructor(      
    public nombre: string ,    
    public _id?: string ,
    public img?: string ,
    public usuario?: _MedicoUSer,
    public hospital?: Hospital ) {}


}