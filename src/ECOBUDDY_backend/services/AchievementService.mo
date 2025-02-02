import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Types "../types/Types";

module {
  public func getUserProgress (userId : Principal, achievementProgs : Types.AchievementProgs) : async Types.AchievementProg{
    switch(achievementProgs.get(userId)){
      case(?isProg){
        isProg;
      };
      case(null){
        let newData = {
          emojiCount = 0;
          messageCount = 0;
          questionCount = 0;
        };
        achievementProgs.put(userId, newData);
        newData;
      }
    };
  };

  public func handleUnlockAchievement(AchievementType : Text, userId : Principal, users : Types.Users) : async Result.Result<Text, Text> {
    // auth
    if (Principal.isAnonymous(userId)) {
      return #err "Anonymous principals are not allowed";
    };

    // query data
    let userData = users.get(userId);

    // validate if exists
    switch (userData) {
      case (null) {
        return #err "User not found";
      };
      case (?currentUser) {
        let updatedAchievements = Array.append(currentUser.achievements, [AchievementType]);
        let updatedUser = {
          id = currentUser.id;
          walletAddress = currentUser.walletAddress;
          username = currentUser.username;
          achievements = updatedAchievements;
          expPoints = currentUser.expPoints;
          level = currentUser.level;
          avatar = currentUser.avatar;
          profile = currentUser.profile;
        };
        users.put(userId, updatedUser);

        return #ok AchievementType;
      };
    };
  };
};
