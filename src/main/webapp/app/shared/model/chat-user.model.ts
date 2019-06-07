import { Moment } from 'moment';
import { IChatRoom } from 'app/shared/model/chat-room.model';
import { IChatMessage } from 'app/shared/model/chat-message.model';
import { IChatRoomAllowedUser } from 'app/shared/model/chat-room-allowed-user.model';
import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';

export interface IChatUser {
  id?: number;
  creationDate?: Moment;
  bannedUser?: boolean;
  userId?: number;
  chatRooms?: IChatRoom[];
  chatMessages?: IChatMessage[];
  chatRoomAllowedUsers?: IChatRoomAllowedUser[];
  offensiveMessages?: IOffensiveMessage[];
}

export class ChatUser implements IChatUser {
  constructor(
    public id?: number,
    public creationDate?: Moment,
    public bannedUser?: boolean,
    public userId?: number,
    public chatRooms?: IChatRoom[],
    public chatMessages?: IChatMessage[],
    public chatRoomAllowedUsers?: IChatRoomAllowedUser[],
    public offensiveMessages?: IOffensiveMessage[]
  ) {
    this.bannedUser = this.bannedUser || false;
  }
}
