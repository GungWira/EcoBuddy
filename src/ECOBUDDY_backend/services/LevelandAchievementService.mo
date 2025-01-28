import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Types "../types/Types";
import AiService "AiService";
import GlobalConstants "../constants/GlobalConstants";


module {
  
  public func handleGetUserLevelDetail(userId : Principal, userLevel: Types.LevelDetails) : async Result.Result<Types.LevelDetail, Text> {
    // auth
    if (Principal.isAnonymous(userId)) {
      return #err "Anonymous principals are not allowed";
    };

    // query data
    let userLevelDetail = userLevel.get(userId);

    // validate if exists
    switch (userLevelDetail) {
      case (null) {
        return #err "User not found";
      };
      case (?currentUser) {
        return #ok currentUser;
      };
    };
  };

 public func handleUpgradeLevel(level : Nat, userId : Principal, userLevel: Types.LevelDetails) : async Result.Result<Types.LevelDetail, Text> {
    // auth
    if (Principal.isAnonymous(userId)) {
      return #err "Anonymous principals are not allowed";
    };

    // query data
    let userLevelDetail = userLevel.get(userId);

    // validate if exists
    switch (userLevelDetail) {
      case (null) {
        return #err "User not found";
      };
      case (?currentUser) {
        let expPerLevel = await calculateExpPerLevel(level);
        if (currentUser.currentExp >= expPerLevel) {
          let updatedUserLevelDetail : Types.LevelDetail = {
            userId = currentUser.userId;
            avatar = currentUser.avatar;
            nextLevel = currentUser.nextLevel + 1;
            expToNextLevel = await calculateExpPerLevel(currentUser.nextLevel + 1);
            currentExp = currentUser.currentExp - expPerLevel;
          };

          // update data exp
          userLevel.put(userId, updatedUserLevelDetail);

          // return exp amount
          return #ok updatedUserLevelDetail;
        } else {
          return #err "Not enough EXP to upgrade level";
        };
      };
    };
  };

  public func handleAddAvatar(name : Text, image : Text, avatarList : Types.Avatars): async Text {
    let avatarData : [(Text, Text)] = [("EPIC", GlobalConstants.AVATAR_EPIC), ("BASIC", GlobalConstants.AVATAR_BASIC), ("ELITE", GlobalConstants.AVATAR_ELITE), ("LEGEND", GlobalConstants.AVATAR_LEGEND), ("MYTHIC", GlobalConstants.AVATAR_MYTHIC)];

    // Loop untuk setiap avatar default
    for ((name, image) in avatarData.vals()) {
      let avatarId : Text = AiService.generateUUID();
      let avatarData = {
        id = avatarId;
        name = name;
        avatar = image;
        createdAt = Time.now();
      };
      avatarList.put(avatarId, avatarData);
    };

    return "Avatar added successfully";
  };

  public func handleUnlockAvatar(level : Nat, userId : Principal, users: Types.Users, avatarList : Types.Avatars) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(userId)) {
      return #err "Anonymous principals are not allowed";
    };

    let userData = users.get(userId);
    switch (userData) {
      case (null) {
        return #err "User not found";
      };
      case (?currentUser) {
        let avatarName = if (level >= 20) {
          "MYTHIC";
        } else if (level >= 15) {
          "LEGEND";
        } else if (level >= 10) {
          "EPIC";
        } else if (level >= 5) {
          "ELITE";
        } else if (level >= 1) {
          "BASIC";
        } else {
          return #err "Invalid level";
        };

        let avatarData = avatarList.get(avatarName);
        switch (avatarData) {
          case (null) {
            return #err "Avatar not found";
          };
          case (?avatar) {
            let updatedUser = {
              id = currentUser.id;
              walletAddress = currentUser.walletAddress;
              username = currentUser.username;
              achievements = currentUser.achievements;
              expPoints = currentUser.expPoints;
              level = currentUser.level;
              avatar = avatar.avatar;
              profile = currentUser.profile;
            };
            users.put(userId, updatedUser);
            return #ok(avatar.name);
          };
        };
      };
    };
  };

  public func handleUnlockAchievement(AchievementType : Text, userId : Principal, users: Types.Users) : async Result.Result<Text, Text> {
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

  // HELPER FUNCTION
  public func calculateExpPerLevel(level : Nat) : async Nat {
    if (level == 0) return 0;
    if (level == 1) return 10;
    return 100 * (level * level) - 90;
  };

}