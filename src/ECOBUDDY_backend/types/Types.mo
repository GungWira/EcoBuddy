import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module{
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
        walletAddres : Text;
    }

  public type UserBalance = {
    id: Principal;
    balance: Nat;
  };

  // MESSAGE TYPES
  public type Message = {
    id : Text;
    sender : Principal;
    content : Text;
    timestamp : Int;
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
}