import Result "mo:base/Result";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Types "../types/Types";
import GlobalConstants "../constants/GlobalConstants";


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
        // CALCULATE USER EXP TO LEVEL UP
        let requireExpToLevelUp = calculateExpPerLevel(currentUser.level + 1);

        let updatedUser : Types.User = switch(currentUser.expPoints + expPoint >= requireExpToLevelUp){
          case(true){
        Debug.print(debug_show("True"));

            let newAvatar = switch(currentUser.level >= 20){
              case(true){
                GlobalConstants.AVATAR_MYTHIC
              };
              case(false){
                switch(currentUser.level >= 15){
                  case(true){
                    GlobalConstants.AVATAR_LEGEND
                  };
                  case(false){
                    switch(currentUser.level >= 10){
                      case(true){
                        GlobalConstants.AVATAR_EPIC
                      };
                      case(false){
                        switch(currentUser.level >= 5){
                          case(true){
                            GlobalConstants.AVATAR_ELITE
                          };
                          case(false){
                            GlobalConstants.AVATAR_BASIC
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
            {
              id = currentUser.id;
              username = currentUser.username;
              level = currentUser.level + 1;
              walletAddress = currentUser.walletAddress;
              expPoints = currentUser.expPoints + expPoint - requireExpToLevelUp;
              achievements = currentUser.achievements;
              avatar = newAvatar;
              profile = currentUser.profile;
            };
          };
          case(false){
            {
              id = currentUser.id;
              username = currentUser.username;
              level = currentUser.level;
              walletAddress = currentUser.walletAddress;
              expPoints = currentUser.expPoints + expPoint;
              achievements = currentUser.achievements;
              avatar = currentUser.avatar;
              profile = currentUser.profile;
            };
          };
        };
      
        // update data exp
        users.put(userId, updatedUser);
        #ok(updatedUser.expPoints);

        // return exp amount
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


  public func calculateExpPerLevel(level : Nat) : Nat {
    return 100 * (level * level) - 100;
  };
};
