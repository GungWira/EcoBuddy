import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  public type Users = HashMap.HashMap<Principal, User>;
  public type Messages = HashMap.HashMap<Text, Message>;
  public type Avatars = HashMap.HashMap<Text, Avatar>;
  public type UserBalances = HashMap.HashMap<Principal, UserBalance>;
  public type LevelDetails = HashMap.HashMap<Principal, LevelDetail>;
  public type Transactions = HashMap.HashMap<Text, Transaction>;
  public type Tokens = HashMap.HashMap<Text, Token>;
  public type TokenTransfers = HashMap.HashMap<Text, TokenTransfer>;
  public type TokenMetadatas = HashMap.HashMap<Text, TokenMetadata>;


  // USER TYPE
  public type User = {
    id : Principal;
    username : Text;
    level : Nat;
    walletAddress : Text;
    expPoints : Nat;
    achievements : [Text];
    avatar : Text;
    profile: Text;
  };

  public type UserBalance = {
    id : Principal;
    balance : Nat;
  };
  

  public type UserUpdateProfile = {
    username : ?Text;
    profile : ?Text;
  };

  // REQ TYPE
  public type HttpRequest = {
    url : Text;
    max_response_bytes : ?Nat64;

    header_host : Text;
    header_content_type : Text;
    header_user_agent : Text;

    body : ?Blob;
    method : HttpMethod;
  };

  public type HttpMethod = {
    #post;
  };

  public type HttpResponse = {
    status : Nat;
    headers : [HttpHeader];
    body : Blob;
  };

  public type HttpHeader = {
    name : Text;
    value : Text;
  };

  // AI TYPE
  public type ResponseAI = {
    solution : Text;
    exp : Nat;
  };

  // CHAT RECORD AND HISTORY TYPE
  public type Message = {
    id : Text;
    sender : Principal;
    content : Text;
    timestamp : Int;
    messageType : MessageType;
  };

  // Enum untuk tipe pesan
  public type MessageType = {
    #UserMessage;
  };

  // Tipe untuk sesi chat
  public type ChatSession = {
    id : Text;
    userId : Principal;
    messages : [Message];
    createdAt : Int;
    updatedAt : Int;
  };

  // Tipe untuk hash dan integritas

  // LEVEL TYPES
  public type LevelDetail = {
    userId : Principal;
    avatar : Avatar;
    nextLevel : Nat;
    expToNextLevel : Nat;
    currentExp : Nat;
  };

  public type AchievementResponse = {
    id : Text;
    name : Text;
    description : Text;
    badge : Text;
    claimedAt : Int;
  };

  // TRANSACTION TYPES
  public type Transaction = {
    id : Text;
    sender : Principal;
    receiver : Principal;
    amount : Nat;
    currency : Text;
    timestamp : Int;
  };

  // TOKEN TYPES
  public type Token = {
    id : Text;
    owner : Principal;
    metadata : Text;
    createdAt : Int;
  };

  public type TokenTransfer = {
    tokenId : Text;
    from : Principal;
    to : Principal;
    timestamp : Int;
  };

  public type TokenMetadata = {
    tokenId : Text;
    metadata : Text;
  };

  // AVATAR TYPES
  public type Avatar = {
    name : Text;
    avatar : Text;
    createdAt : Int;
  };
};
