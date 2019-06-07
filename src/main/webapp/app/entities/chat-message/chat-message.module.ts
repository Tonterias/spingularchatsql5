import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { Spingularchatsql5SharedModule } from 'app/shared';
import {
  ChatMessageComponent,
  ChatMessageDetailComponent,
  ChatMessageUpdateComponent,
  ChatMessageDeletePopupComponent,
  ChatMessageDeleteDialogComponent,
  chatMessageRoute,
  chatMessagePopupRoute
} from './';

const ENTITY_STATES = [...chatMessageRoute, ...chatMessagePopupRoute];

@NgModule({
  imports: [Spingularchatsql5SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ChatMessageComponent,
    ChatMessageDetailComponent,
    ChatMessageUpdateComponent,
    ChatMessageDeleteDialogComponent,
    ChatMessageDeletePopupComponent
  ],
  entryComponents: [ChatMessageComponent, ChatMessageUpdateComponent, ChatMessageDeleteDialogComponent, ChatMessageDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Spingularchatsql5ChatMessageModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
