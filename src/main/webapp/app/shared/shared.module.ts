import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentAdapter } from './util/datepicker-adapter';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  Spingularchatsql5SharedLibsModule,
  Spingularchatsql5SharedCommonModule,
  JhiLoginModalComponent,
  HasAnyAuthorityDirective,
  ChatService
} from './';

@NgModule({
  imports: [Spingularchatsql5SharedLibsModule, Spingularchatsql5SharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }, ChatService],
  entryComponents: [JhiLoginModalComponent],
  exports: [Spingularchatsql5SharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Spingularchatsql5SharedModule {
  static forRoot() {
    return {
      ngModule: Spingularchatsql5SharedModule
    };
  }
}
