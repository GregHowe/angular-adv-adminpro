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

}