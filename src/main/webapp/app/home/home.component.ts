import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ChatService } from '../shared';

import { LoginModalService, AccountService, Account } from 'app/core';

import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IChatRoom } from 'app/shared/model/chat-room.model';

import { ITEMS_PER_PAGE } from 'app/shared';
import { ChatRoomService } from '../entities/chat-room/chat-room.service';

import { IChatMessage } from 'app/shared/model/chat-message.model';
import { ChatMessageService } from '../entities/chat-message/chat-message.service';

import { IChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from '../entities/chat-user/chat-user.service';

import { IChatRoomAllowedUser } from 'app/shared/model/chat-room-allowed-user.model';
import { ChatRoomAllowedUserService } from '../entities/chat-room-allowed-user/chat-room-allowed-user.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  modalRef: NgbModalRef;
  messages: Array<Object> = [];
  message = '';

  chatMessage: IChatMessage;
  chatMessages: IChatMessage[];
  chatUser: IChatUser;
  chatUsers: IChatUser[];
  chatRooms: IChatRoom[];
  chatRoomAllowedUsers: IChatRoomAllowedUser[];

  currentAccount: any;
  error: any;
  success: any;
  eventSubscriber: Subscription;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  currentChatRoomId: number;

  arrayAux = [];
  arrayIds = [];

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private eventManager: JhiEventManager,
    private chatService: ChatService,
    protected chatRoomService: ChatRoomService,
    protected chatMessageService: ChatMessageService,
    protected chatUserService: ChatUserService,
    protected chatRoomAllowedUserService: ChatRoomAllowedUserService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit() {
    this.chatService.connect();

    this.chatService.receive().subscribe(message => {
      this.messages.push(message);
    });

    this.accountService.identity().then(account => {
      this.currentAccount = account;
      const query = {};
      query['id.equals'] = this.currentAccount.id;
      //      console.log('CONSOLOG: M:ngOnInit & O: query : ', query);
      this.chatUserService.query(query).subscribe(
        (res: HttpResponse<IChatUser[]>) => {
          this.chatUser = res.body[0];
          //          console.log('CONSOLOG: M:ngOnInit & O: this.chatUser : ', this.chatUser);
          this.myChatRooms();
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    });

    this.registerChangeInChatRooms();

    this.registerAuthenticationSuccess();
    this.registerLogoutSuccess();
  }

  myChatRooms() {
    const query = {};
    if (this.currentAccount.id != null) {
      query['chatUserId.equals'] = this.chatUser.id;
      query['queryParams'] = 1;
    }
    this.chatRoomService.query(query).subscribe(
      //          (res: HttpResponse<IChatRoom[]>) => this.paginateChatRooms(res.body, res.headers),
      (res: HttpResponse<IChatRoom[]>) => {
        this.chatRooms = res.body;
        //                console.log('CONSOLOG: M:myChatRooms & O: query : ', query);
        //                console.log('CONSOLOG: M:myChatRooms & O: this.chatRooms : ', this.chatRooms);
        const query2 = {};
        query2['chatUserId.equals'] = this.chatUser.id;
        query2['bannedUser.equals'] = 'false';
        query2['queryParams'] = 1;
        this.chatRoomAllowedUserService.query(query2).subscribe(
          (res2: HttpResponse<IChatRoomAllowedUser[]>) => {
            //                          console.log('CONSOLOG: M:myChatRooms & O: query2 : ', query2);
            this.chatRoomAllowedUsers = res2.body;
            //                          console.log('CONSOLOG: M:myChatRooms & O: chatRoomAllowedUsers : ', this.chatRoomAllowedUsers);
            if (this.chatRoomAllowedUsers != null) {
              const arrayChatRoomAllowedUsers = [];
              this.chatRoomAllowedUsers.forEach(chatRoomAllowedUser => {
                //                                  console.log('CONSOLOG: M:myChatRooms & O: arrayChatRoomAllowedUsers : ', arrayChatRoomAllowedUsers);
                arrayChatRoomAllowedUsers.push(chatRoomAllowedUser.chatRoomId);
              });
              const query3 = {};
              query3['id.in'] = arrayChatRoomAllowedUsers;
              this.chatRoomService.query(query3).subscribe(
                (res3: HttpResponse<IChatRoom[]>) => {
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: query3 : ', query3);
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: CR+res3.body : ', res3.body);
                  this.chatRooms = this.filterArray(this.chatRooms.concat(res3.body));
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: this.chatRooms : ', this.chatRooms);
                },
                (res3: HttpErrorResponse) => this.onError(res3.message)
              );
            }
            //                          console.log('CONSOLOG: M:myChatRoomsPOST & O: this.chatRooms : ', this.chatRooms);
          },
          (res2: HttpErrorResponse) => this.onError(res2.message)
        );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private filterArray(chatRooms) {
    this.arrayAux = [];
    this.arrayIds = [];
    chatRooms.map(x => {
      if (this.arrayIds.length >= 1 && this.arrayIds.includes(x.id) === false) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
        //        console.log('CONSOLOG: M:filterArray & O: this.arrayAux.push(x) : ', this.arrayAux);
        //        console.log('CONSOLOG: M:filterArray & O: this.arrayIds : ', this.arrayIds);
      } else if (this.arrayIds.length === 0) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
        //        console.log('CONSOLOG: M:filterArray & O: else this.arrayAux.push(x) : ', this.arrayAux);
        //        console.log('CONSOLOG: M:filterArray & O: else this.arrayIds : ', this.arrayIds);
      }
    });
    //    console.log('CONSOLOG: M:filterInterests & O: this.follows : ', this.arrayIds, this.arrayAux);
    return this.arrayAux;
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', message => {
      this.accountService.identity().then(account => {
        this.currentAccount = account;
        this.chatService.disconnect();
        this.chatService.connect();
      });
    });
  }

  registerLogoutSuccess() {
    this.eventManager.subscribe('logoutSuccess', message => {
      this.chatService.disconnect();
      this.chatService.connect();
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  sendMessage(message) {
    if (message.length === 0) {
      return;
    }
    this.chatMessage = new Object();
    this.chatMessage.chatUserId = this.currentAccount.id;
    this.chatMessage.chatRoomId = this.currentChatRoomId;
    this.chatMessage.message = message;
    //    console.log('CONSOLOG: M:sendMessage & O: this.chatMessage: ', this.chatMessage);
    this.chatService.sendMessage(this.chatMessage);
    this.message = '';
  }

  loadAll() {}

  fetchChatRoom(chatRoomId) {
    //    console.log('CONSOLOG: M:fetchChatRoom & O: chatRoomId : ', chatRoomId);
    this.currentChatRoomId = chatRoomId;
    if (chatRoomId !== undefined) {
      const query = {};
      query['chatRoomId.equals'] = this.currentChatRoomId;
      //      query['queryParams'] = 1;
      //      console.log('CONSOLOG: M:fetchChatRoom & O: query : ', query);
      this.chatMessageService.query(query).subscribe(
        (res: HttpResponse<IChatMessage[]>) => {
          this.messages = res.body;
          //          console.log('CONSOLOG: M:fetchChatRoom & O: this.messages : ', this.messages);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  registerChangeInChatRooms() {
    this.eventSubscriber = this.eventManager.subscribe('chatRoomListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateChatRooms(data: IChatRoom[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.chatRooms = data;
    //    console.log('CONSOLOG: M:paginateChatRooms & O: this.chatRooms : ', this.chatRooms);
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
