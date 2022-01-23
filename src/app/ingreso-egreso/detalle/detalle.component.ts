import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  public ingresosEgresos: IngresoEgreso[] = [];
  private _ingresosEgresosSubscription$: Subscription;

  constructor(
    private store: Store<AppState>,
    private _ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit() {
    this._ingresosEgresosSubscription$ = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => (this.ingresosEgresos = items));
  }

  ngOnDestroy(): void {
    this._ingresosEgresosSubscription$.unsubscribe();
  }

  delete(uid: string) {
    this._ingresoEgresoService
      .deleteIngresoEgreso(uid)
      .then(() => Swal.fire('Borrado', 'Item borrado', 'success'))
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  }
}
