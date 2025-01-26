import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  public type Users = HashMap.HashMap<Principal, User>;
  public type UserBalances = HashMap.HashMap<Principal, UserBalance>;
  public type Messages = HashMap.HashMap<Text, Message>;
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
  };

  public type UserBalance = {
    id : Principal;
    balance : Nat;
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

  // MESSAGE & CHAT TYPES
  public type Message = {
    id : Text;
    userId : Principal;
    content : Text;
    timestamp : Int;
    messageType : MessageType;
  };

  private type MessageType = {
    #UserMessage;
    #AiMessage;
    #SystemMessage;
  };

  public type ChatSession = {
    id : Text;
    userId : Principal;
    messages : [Message];
    createdAt : Int;
    updatedAt : Int;
  };

  public type ChatRecord = {
    session : ChatSession;
    previousHash : ?Text;
    currentHash : Text;
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
};
