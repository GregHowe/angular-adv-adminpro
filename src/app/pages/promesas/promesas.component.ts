import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [],
})
export class PromesasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {

    // this.getUsuarios();

this.getUsuarios().then( usuarios =>  { 
  console.log(usuarios);
 } )

    // const promesa = new Promise((resolve, reject) => {
    //   if (false)
    //     resolve('Hola Mundo');
    //     else
    //     reject('Salio mal');
    // });

    // promesa.then( ( msg ) => {
    //     console.log( msg );
    // } )
    // .catch(error => console.log('Error en mi promesa', error));

    // console.log('-fin de Init');

  }

  getUsuarios(){

    // fetch( 'https://reqres.in/api/users' )
    // .then( resp => {
    //   resp.json().then(body => console.log(body))
    // } );

    return new Promise( resolve => {

      fetch( 'https://reqres.in/api/users' )
          .then(  resp =>  resp.json() )
              .then(  body =>  resolve(body.data)  );

    } )  ;

  }

}
