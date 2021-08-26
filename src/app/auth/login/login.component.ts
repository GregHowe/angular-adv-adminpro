import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  
  public formSubmitted = false;
  public auth2 : any;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ], //email000@gmail.com
    password: ['', [Validators.required]], //123456
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    this.usuarioService.login(this.loginForm.value)
    .subscribe( resp => {
        //console.log(resp);
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }

        //Navegar al dashboard
         this.router.navigateByUrl('/');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
    // this.router.navigateByUrl('/');
    // console.log(this.loginForm.value)
  }

  // var id_token = googleUser.getAuthResponse().id_token;
  // onSuccess(googleUser:any) {
  //   //console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  //   console.log(id_token);
  // }
  // onFailure(error:any) {
  //   console.log(error);
  // }



  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark'
    });
    this.startApp();
  }

   async startApp() {

    // gapi.load('auth2', () => {
    //   // Retrieve the singleton for the GoogleAuth library and set up the client.
    //   this.auth2 = gapi.auth2.init({
    //     client_id: '320234814841-hb3hovp7o4qede1q62ulqfc9gn46jlud.apps.googleusercontent.com',
    //     cookiepolicy: 'single_host_origin',
    //     // Request scopes in addition to 'profile' and 'email'
    //     //scope: 'additional_scope'
    //   });
      await this.usuarioService.googleInit();
      this.auth2 = this.usuarioService.auth2;
      this.attachSignin(document.getElementById('my-signin2'));
  };

   attachSignin(element: any) {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser: any) =>  {
          var id_token = googleUser.getAuthResponse().id_token;
          // console.log(id_token);
          this.usuarioService.loginGoogle(id_token)
          .subscribe(resp => {
            //Navegar al Dashboard
            this.ngZone.run( () => {
            this.router.navigateByUrl('/');
          })

          });

          

        }, (error:any) =>  {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}
