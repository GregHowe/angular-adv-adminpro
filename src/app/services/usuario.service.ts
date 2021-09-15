import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { LoginForm } from '../interfaces/login-form.interfaces';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import {   of } from 'rxjs';
import { Router } from '@angular/router';

import { Usuario } from '../models/usuario.model';



const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario | undefined;

  constructor( private http: HttpClient, 
                    private router : Router,
                    private ngZone: NgZone ) {
    this.googleInit();                      
                     }

    get token() :string {
      return  localStorage.getItem('token') || '';
    }                 

    get role():'ADMIN_ROLE' | 'USER_ROLE'{
        return this.usuario?.role!;
    }

    get uid() : string{
      return this.usuario?.uid || '';
    }

    get headers() {
      return {
        headers: {
          'x-token': this.token
       }
      }
    }


    googleInit(){

      return new Promise<void>( resolve => {
        console.log('google init');

        gapi.load('auth2', () => {
          this.auth2 = gapi.auth2.init({
            client_id: '320234814841-hb3hovp7o4qede1q62ulqfc9gn46jlud.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
          });
          resolve();
         // this.attachSignin(document.getElementById('my-signin2'));
        });
      })

     
    }

guardarlocalStorage(  token:string, menu: any ){

  localStorage.setItem('token', token)
  localStorage.setItem('menu',  JSON.stringify( menu));

}


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then( () => {
      this.ngZone.run( () => {
      this.router.navigateByUrl('/login');
      })
    });

  }

  validarToken(){

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
         'x-token': this.token
      }
    }).pipe(
      map( (resp: any )=> {

        const { email,  google,  nombre, role, img  = '', uid } = resp.usuario;
        
        this.usuario = new Usuario(nombre, email, '', role,google,  img , uid);
        // console.log(this.usuario);
        // localStorage.setItem('token', resp.token)
        // localStorage.setItem('menu', resp.menu)
        this.guardarlocalStorage(resp.token, resp.menu);

        return true;
      }),
      // map(resp => true ),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm){

    console.log(formData)
    return this.http.post(`${ base_url }/usuarios`, formData )
            .pipe(
              tap( (resp:any) => {
                  // console.log(resp);
                  // localStorage.setItem('token', resp.token)
                  // localStorage.setItem('menu', resp.menu)
                  this.guardarlocalStorage(resp.token, resp.menu);
              })
            )

  }

  actualizarPerfil( data: {email:string, nombre:string, role: any}){

    data = {
      ...data,
      role: this.usuario?.role
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers);

  }

  login(formData: LoginForm) {

    // console.log(formData)
    return this.http.post(`${ base_url }/login`, formData )
                  .pipe(
                    tap( (resp:any) => {
                        // console.log(resp);
                        // localStorage.setItem('token', resp.token)
                        this.guardarlocalStorage(resp.token, resp.menu);
                    })
                  )

  }

  loginGoogle( token: any) {

    // console.log(formData)
    return this.http.post(`${ base_url }/login/google`, {token} )
                  .pipe(
                    tap( (resp:any) => {
                        // console.log(resp);
                        // localStorage.setItem('token', resp.token)
                        this.guardarlocalStorage(resp.token, resp.menu);
                    })
                  )

  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${ desde}`;
    // return this.http.get(url, this.headers)
    return this.http.get<CargarUsuario>(url, this.headers)  
              .pipe(
                //delay(5000),
                map( resp => {
                  
                  const usuarios = resp.usuarios.map( 
                              user => new Usuario(user.nombre, user.email, '', user.role, user.google, user.img, user.uid )
                      );

                  return {
                    total: resp.total
                    ,usuarios
                  };
                } )
              )


  }

  eliminarUsuario( usuario: Usuario ){
   
    const url = `${base_url}/usuarios/${ usuario.uid }`;
    return this.http.delete(url, this.headers)
 
  }

  guardarUsuario( usuario: Usuario){

    // console.log(  `${ base_url }/usuarios/${ usuario.uid }` );
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers);

  }


}
