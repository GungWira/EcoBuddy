import Result "mo:base/Result";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Types "../types/Types";

module {
  public func addExpToChain(expPoint : Nat, userId : Principal, users : Types.Users) : async Result.Result<Nat, Text> {
    // auth
    if (Principal.isAnonymous(userId)) {
      return #err("Anonymous principals are not allowed");
    };

    // query data
    let user = users.get(userId);

    // validate if exists
    switch (user) {
      case (null) {
        #err("User not found");
      };
      case (?currentUser) {

        let updatedUser : Types.User = {
          id = currentUser.id;
          username = currentUser.username;
          level = currentUser.level;
          walletAddress = currentUser.walletAddress;
          expPoints = currentUser.expPoints + expPoint;
          achievements = currentUser.achievements;
          avatar = currentUser.avatar;
        };

        // update data exp
        users.put(userId, updatedUser);

        // return exp amount
        #ok(currentUser.expPoints + expPoint);
      };
    };
  };

  public func totalExp(userId : Principal, users : Types.Users) : async Result.Result<Nat, Text> {
    // auth
    if (Principal.isAnonymous(userId)) {
      return #err("Anonymous principals are not allowed");
    };

    // query data
    let user = users.get(userId);

    // validate if exists
    switch (user) {
      case (null) {
        #err("User not found");
      };
      case (?currentUser) {
        #ok(currentUser.expPoints);
      };
    };
  };
};
