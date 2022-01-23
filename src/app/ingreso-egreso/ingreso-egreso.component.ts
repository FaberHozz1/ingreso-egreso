import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  public ingresoEgresoForm: FormGroup;
  public type: string = 'ingreso';
  public loading: boolean = false;
  public loadingSuscription$: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.loadingSuscription$ = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.loading = isLoading));
    this.ingresoEgresoForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.loadingSuscription$.unsubscribe();
  }

  save() {
    if (this.ingresoEgresoForm.invalid) return;
    console.log(this.ingresoEgresoForm.value);
    this.store.dispatch(ui.isLoading());

    const { description, amount } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(description, amount, this.type);
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then((ref) => {
        Swal.fire('Registro creado', description, 'success');
        this.store.dispatch(ui.stopLoading());
        this.ingresoEgresoForm.reset();
        console.log('--> exito: ', ref);
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error', err.message, 'error');
        console.warn(err);
      });
  }
}
