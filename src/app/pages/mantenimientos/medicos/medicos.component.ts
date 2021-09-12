import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs!: Subscription; 
  
  constructor(private medicoService: MedicoService, 
    private busquedasServices: BusquedasService,
    private modalImagenService: ModalImagenService) { }


  ngOnDestroy(): void {

    this.imgSubs.unsubscribe();

  }

  ngOnInit(): void {
    this.cargaMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(800))
    .subscribe( img => {
        this.cargaMedicos()}
    );


  }

  cargaMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
        console.log(medicos);
      });
    
  }

  abrirModal(medico:Medico){

    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
   
  }

  buscar(termino: string){

    if (termino.length === 0 ){
         return this.cargaMedicos();
    }

   this.busquedasServices.buscar( 'medicos', termino)
    .subscribe( resultados => {
      this.medicos = resultados
    });
  }

  
  borrarMedico(medico:Medico){

    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta a punto de borrar a ${ medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {

      if (result.value) {      
        
        this.medicoService.borrarMedico(medico._id!)
        .subscribe( resp => {
          this.cargaMedicos();
          Swal.fire( 'Médico borrado!', `${medico.nombre} fue eliminado correctamente`,'success')
        }
        )
      }

    })

  }



}
