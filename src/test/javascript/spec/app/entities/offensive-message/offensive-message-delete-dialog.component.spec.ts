/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Spingularchatsql5TestModule } from '../../../test.module';
import { OffensiveMessageDeleteDialogComponent } from 'app/entities/offensive-message/offensive-message-delete-dialog.component';
import { OffensiveMessageService } from 'app/entities/offensive-message/offensive-message.service';

describe('Component Tests', () => {
  describe('OffensiveMessage Management Delete Component', () => {
    let comp: OffensiveMessageDeleteDialogComponent;
    let fixture: ComponentFixture<OffensiveMessageDeleteDialogComponent>;
    let service: OffensiveMessageService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Spingularchatsql5TestModule],
        declarations: [OffensiveMessageDeleteDialogComponent]
      })
        .overrideTemplate(OffensiveMessageDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OffensiveMessageDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OffensiveMessageService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
