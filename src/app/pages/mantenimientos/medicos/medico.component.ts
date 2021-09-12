import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicoService } from 'src/app/services/medico.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  constructor(private medicoService: MedicoService,
                    private hospitalService: HospitalService,
                    private fb: FormBuilder,
                    private router : Router, 
                    private activateRouter : ActivatedRoute, ) { }

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  
  public hospitalSeleccionado!: Hospital;
  public medicoSeleccionado!: Medico;
  

  ngOnInit(): void {

    this.activateRouter.params
      .subscribe( ({id}) =>  this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
    .subscribe( hospitalId => {
     
      this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId)!;
      // console.log(this.hospitalSeleccionado);
    })
  }

cargarMedico(id: string){
  
  if ( id === 'nuevo')
  {
      return;
  }

  this.medicoService.obtenerMedicoPorId(id)
  .pipe(
    delay(100)
  )
  .subscribe( medico => {

      if (!medico){
        this.router.navigateByUrl( `/dashboard/medicos`);
        return;
      }

      const { nombre, hospital  } = medico;
      this.medicoForm.setValue( {nombre, hospital: hospital!._id })
      this.medicoSeleccionado = medico;

  })
 
}

cargarHospitales(){
  
  this.hospitalService.cargarHospitales()
  .subscribe( (hospitales: Hospital[]) => {
        // console.log(hospitales);
        this.hospitales = hospitales;
  })
}

guardarMedico(){

  const {nombre} = this.medicoForm.value;

      if ( this.medicoSeleccionado)
      {
          const data = {
            ...this.medicoForm.value,
            _id: this.medicoSeleccionado._id
          }
          this.medicoService.actualizarMedico(data)
          .subscribe( resp => {
            Swal.fire('Actualizado', `${ nombre} actualizado correctamente` , 'success');
          })
    }
    else{
      
        this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe( (resp: any) => {
            Swal.fire('Creado', `${ nombre} creado correctamente` , 'success');
            this.router.navigateByUrl( `/dashboard/medico/${resp.medico._id}`);
        })
    }
}

}
