import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { Spingularchatsql5SharedModule } from 'app/shared';
import {
  ChatRoomComponent,
  ChatRoomDetailComponent,
  ChatRoomUpdateComponent,
  ChatRoomDeletePopupComponent,
  ChatRoomDeleteDialogComponent,
  chatRoomRoute,
  chatRoomPopupRoute
} from './';

const ENTITY_STATES = [...chatRoomRoute, ...chatRoomPopupRoute];

@NgModule({
  imports: [Spingularchatsql5SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ChatRoomComponent,
    ChatRoomDetailComponent,
    ChatRoomUpdateComponent,
    ChatRoomDeleteDialogComponent,
    ChatRoomDeletePopupComponent
  ],
  entryComponents: [ChatRoomComponent, ChatRoomUpdateComponent, ChatRoomDeleteDialogComponent, ChatRoomDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Spingularchatsql5ChatRoomModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
