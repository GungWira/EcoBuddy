import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Types "../types/Types";

module {
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
