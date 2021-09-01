import { environment } from "src/environments/environment"

const base_url = environment.base_url;

export class Usuario{

/**
 *
 */
constructor(      
    public nombre: string ,
    public email: string ,
    public pasword?: string ,
    public role?: string ,
    public google?: boolean ,
    public img?: string ,
    public uid?: string ) {}

    // imprimirUsuario(){
    //     console.log(this.nombre);
    // }

    get imageUrl()  {
        
        // return 'http://localhost:3000/api/upload/usuarios/0345e584-e581-4c0a-a963-1a3416d93fa0.png';

        if (this.img?.includes('https')){
            return this.img;
        }

        // console.log(this.img);
        if ( this.img){
            // console.log(`${ base_url }/upload/usuarios/${this.img}`);
            return `${ base_url }/upload/usuarios/${this.img}`;
        }else{
            // console.log(`${ base_url }/upload/usuarios/no-image`);
            return  `${ base_url }/upload/usuarios/no-image`;
        }
    }

}