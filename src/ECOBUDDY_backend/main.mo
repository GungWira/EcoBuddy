import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";


import Types "types/Types";
import UserService "services/UserService";

actor EcoBuddy {
  // DATA
  private var users : Types.Users = HashMap.HashMap(
    10,                 
    Principal.equal,   
    Principal.hash    
  );

  // DATA ENTRIES
  private stable var usersEntries : [(Principal, Types.User)] = [];

  // PREUPGRADE & POSTUPGRADE FUNC TO KEEP DATA
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
  };

  // USERS ------------------------------------------------------------------ USERS  
  
  public shared (msg) func createUser(
    walletAddres: Text
    ): async Result.Result<Types.User, Text> {
    return UserService.createUser(users, msg.caller, walletAddres);
  };

  public query func getUserById(userId : Principal) : async ?Types.User {
    return users.get(userId);
  };

  public shared (msg) func updateUser(username : Text) : async Result.Result<Types.User, Text> {
    return UserService.updateUser(users, msg.caller, username);
  };

};
