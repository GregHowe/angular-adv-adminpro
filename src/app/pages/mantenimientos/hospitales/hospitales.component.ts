import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  ;public hospitales:Hospital[] = [];
  ;public cargando:boolean = true;
  private imgSubs!: Subscription; 

  constructor(private hospitalService:  HospitalService,
                    private busquedasServices: BusquedasService,
                    private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    
    this.imgSubs.unsubscribe();

  }

  ngOnInit(): void {

      this.cargarHospitales();

      this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(800))
      .subscribe( img => {
          this.cargarHospitales()}
      );

      
  }

  buscar(termino: string){

    if (termino.length === 0 ){
         return this.cargarHospitales();
    }

   this.busquedasServices.buscar( 'hospitales', termino)
    .subscribe( resultados => {
      this.hospitales = resultados
    });
  }


  cargarHospitales(){

    this.cargando = true;

    this.hospitalService.cargarHospitales()
    .subscribe( hospitales => {
      // console.log(hospitales);
      this.cargando = false;
      this.hospitales = hospitales;
    })


  }

  guardarCambios(hospital:Hospital){

    this.hospitalService.actualizarHospital( hospital._id!, hospital.nombre)
    .subscribe(resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    })

  }

  eliminarHospital(hospital:Hospital){

    this.hospitalService.borrarHospital( hospital._id!)
    .subscribe(resp => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success');
    })

  }

  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo Hospital',
      input: 'text',
      //inputLabel: 'URL address',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })
    
    if (value!.trim().length>0){
      this.hospitalService.crearHospital(value!)
      .subscribe( (resp:any) => {
        this.hospitales.push(resp.hospital)
      })
    }
    console.log(value);
  }

  abrirModal(hospital:Hospital){

    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);
   
  }

}
