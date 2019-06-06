import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  Spingularchatsql5SharedLibsModule,
  Spingularchatsql5SharedCommonModule,
  JhiLoginModalComponent,
  HasAnyAuthorityDirective
} from './';

@NgModule({
  imports: [Spingularchatsql5SharedLibsModule, Spingularchatsql5SharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
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
