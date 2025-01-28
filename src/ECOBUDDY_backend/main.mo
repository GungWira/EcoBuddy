import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";

import Types "types/Types";
import UserService "services/UserService";
import AiService "services/AiService";
import ExpService "services/ExpService";
import GlobalConstants "constants/GlobalConstants";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Bool "mo:base/Bool";

actor EcoBuddy {
  // DATA
  private var users : Types.Users = HashMap.HashMap<Principal, Types.User>(
    10,
    Principal.equal,
    Principal.hash,
  );

  private var userLevel : Types.LevelDetails = HashMap.HashMap<Principal, Types.LevelDetail>(
    10,
    Principal.equal,
    Principal.hash,
  );

  private var messageRecords : Types.Messages = HashMap.HashMap<Text, Types.Message>(
    10,
    Text.equal,
    Text.hash,
  );

  private var avatarList : Types.Avatars = HashMap.HashMap<Text, Types.Avatar>(
    10,
    Text.equal,
    Text.hash,
  );

  // fun talker achievement
  private var EmojiCount = 0;

  // knowledge seeker achievement
  private var messageCount : Nat = 0;

  // curious starter achievement
  private var questionCount : Nat = 0;

  public type AchievementList = {
    #Conversation_Starter;
    #Fun_Talker;
    #Curious_Starter;
    #Knowledge_Spreader;
  };

  private var AchievementCollected : [Text] = [];

  // DATA ENTRIES
  private stable var usersEntries : [(Principal, Types.User)] = [];

  // SYSTEM FUNCTION
  // PREUPGRADE & POSTUPGRADE FUNC TO KEEP DATA
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
  };
  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
  };

  // USERS ------------------------------------------------------------------ USERS

  public query (message) func getPrincipal() : async Principal {
    message.caller;
  };

  public shared (msg) func createUser(
    walletAddress : Text
  ) : async Result.Result<Types.User, Text> {
    return await UserService.createUser(users, msg.caller, walletAddress);
  };

  public query func getUserById(userId : Principal) : async ?Types.User {
    return users.get(userId);
  };

  public shared (msg) func updateUser(username : Text) : async Result.Result<Types.User, Text> {
    return UserService.updateUser(users, msg.caller, username);
  };

  // AI RESPONSE ------------------------------------------------------------------- AI RESPONSE
  var passAnswer : Text = "";

  public func askBot(input : Text, userId : Principal) : async Result.Result<Types.ResponseAI, Text> {
    let getAchievement = await checkAchievement(userId);

    switch (getAchievement) {
      case (false) {
        return #err "User not found";
      };
      case (true) {
        var achievements : [Text] = [];

        let res = await AiService.httpReq(input, passAnswer);
        let generatedUUID = AiService.generateUUID();

        switch (res) {
          case (#err(s)) { #err s };
          case (#ok(result)) {
            let addUserEXP = await addExp(Int.abs(result.exp), userId);
            switch (addUserEXP) {
              case (#err(_)) { #err("Error Adding User EXP") };
              case (#ok(expOk)) {
                var final = {
                  solution = result.solution;
                  exp = expOk;
                };
                // CONVERSATION STARTER ACHIEVEMENT
                if (Array.find<Text>(AchievementCollected, func(x) { x == "Fun_Talker" }) == null) {
                  let conversation_starter_result = await unlockAchievement("Conversation_Starter", userId);
                  switch (conversation_starter_result) {
                    case (#err(_)) {};
                    case (#ok(value)) {
                      achievements := Array.append(achievements, [value]);
                      final := {
                        solution = result.solution;
                        exp = result.exp;
                        achievement = achievements;
                      };
                    };
                  };
                };

                // FUN TALKER ACHIEVEMENT
                if ((Text.contains(result.solution, #text "🌱") or Text.contains(result.solution, #text "🌍")) and EmojiCount != 5) {
                  EmojiCount += 1;
                };

                if (EmojiCount >= 5 and Array.find<Text>(AchievementCollected, func(x) { x == "Fun_Talker" }) == null) {
                  let fun_talker_result = await unlockAchievement("Fun_Talker", userId);
                  switch (fun_talker_result) {
                    case (#err(_)) {};
                    case (#ok(value)) {
                      achievements := Array.append(achievements, [value]);
                      final := {
                        solution = result.solution;
                        exp = result.exp;
                        achievement = achievements;
                      };
                    };
                  };
                };

                // KNOWLEDGE SPREADER ACHIEVEMENT
                if (messageCount < 10) {
                  messageCount += 1;
                };

                if (messageCount >= 10 and Array.find<Text>(AchievementCollected, func(x) { x == "Knowledge_Spreader" }) == null) {
                  let knowledge_spreader_result = await unlockAchievement("Knowledge_Spreader", userId);
                  switch (knowledge_spreader_result) {
                    case (#err(_)) {};
                    case (#ok(value)) {
                      achievements := Array.append(achievements, [value]);
                      final := {
                        solution = result.solution;
                        exp = result.exp;
                        achievement = achievements;
                      };
                    };
                  };
                };

                // CURIOUS STARTER ACHIEVEMENT
                if (Text.contains(input, #text "?") and questionCount < 5) {
                  questionCount += 1;
                };

                if (questionCount >= 5 and Array.find<Text>(AchievementCollected, func(x) { x == "Curious_Starter" }) == null) {
                  let curious_starter_result = await unlockAchievement("Curious_Starter", userId);
                  switch (curious_starter_result) {
                    case (#err(_)) {};
                    case (#ok(value)) {
                      achievements := Array.append(achievements, [value]);
                      final := {
                        solution = result.solution;
                        exp = result.exp;
                        achievement = achievements;
                      };
                    };
                  };
                };

                messageRecords.put(
                  generatedUUID,
                  {
                    id = generatedUUID;
                    sender = userId;
                    content = input;
                    timestamp = Time.now();
                    messageType = #UserMessage;
                  },
                );

                #ok final;
              };
            };

          };
        };
      };
    };
  };

  // EXP POINT ------------------------------------------------------------------- EXP POINT
  public func addExp(expPoint : Nat, userId : Principal) : async Result.Result<Nat, Text> {
    return await ExpService.addExpToChain(expPoint, userId, users);
  };

  public func getTotalExp(userId : Principal) : async Result.Result<Nat, Text> {
    return await ExpService.totalExp(userId, users);
  };

  // LEVEL & ACHIEVEMENT-------------------------------------------------------------------- LEVEL & ACHIEVEMENT
  public func calculateExpPerLevel(level : Nat) : async Nat {
    if (level == 0) return 0;
    if (level == 1) return 10;
    return 100 * (level * level) - 90;
  };

  public func getUserLevelDetail(userId : Principal) : async Result.Result<Types.LevelDetail, Text> {
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

  public func upgradeLevel(level : Nat, userId : Principal) : async Result.Result<Types.LevelDetail, Text> {
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

  public func addAvatar(name : Text, image : Text) {
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
  };

  public func unlockAvatar(level : Nat, userId : Principal) : async Result.Result<Text, Text> {
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
            };
            users.put(userId, updatedUser);
            return #ok(avatar.name);
          };
        };
      };
    };
  };

  public func checkAchievement(userId : Principal) : async Bool {
    // auth
    if (Principal.isAnonymous(userId)) {
      return false;
    };

    // query data
    let userData = users.get(userId);

    // validate if exists
    switch (userData) {
      case (null) {
        return false;
      };
      case (?currentUser) {
        AchievementCollected := currentUser.achievements;
        return true;
      };
    };
  };

  public func unlockAchievement(AchievementType : Text, userId : Principal) : async Result.Result<Text, Text> {
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
        };
        users.put(userId, updatedUser);

        return #ok AchievementType;
      };
    };
  };
};

//todo set level ketika user register, set avatar ketika user register, set exp ketika user register

// public func getLevelRequirements(level: Nat) {

// };

// // ACHIEVEMENT ------------------------------------------------------------------- ACHIEVEMENT
// public func createAchievement() {

// };

// public func getAchievements(userId: Principal) {

// };

// public func trackProgress(achievementId: Text) {

// };

// public func awardAchievement(userId: Principal, achievementId: Text) {

// };

// calculateExperience(actions: [Action]): Calculate experience points
// upgradeLevelStatus(): Check and upgrade level if eligible
// getLevelRequirements(level: Nat): Get requirements for specific level
// getProgressToNextLevel(): Get progress towards next level
// getLevelHistory(): Get user's level progression history
// unlockLevelFeatures(level: Nat): Unlock features for current level
// checkLevelPrivileges(): Check available privileges for current level

// CHAT HISTORY ------------------------------------------------------------------- CHAT HISTORY

// registerUser(profile: UserProfile): Register new user with Internet Identity
// getProfile(userId: Principal): Retrieve user profile
// updateProfile(updates: ProfileUpdates): Update user profile information
// deleteAccount(): Delete user account and associated data
// getUserStats(): Get user statistics and activity metrics
// linkInternetIdentity(identity: Identity): Link Internet Identity to user account
// upgradeToPremuim(): Upgrade user account to premium status
// validateSession(): Validate current user session
// revokeSession(sessionId: Text): Revoke specific session
// listActiveSessions(): List all active user sessions

// Achievement Endpoints
// createAchievement(data: AchievementData): Create new achievement type
// getAchievements(userId: Principal): Get user's achievements
// trackProgress(achievementId: Text): Track progress towards achievement
// awardAchievement(userId: Principal, achievementId: Text): Award achievement to user
// validateAchievementCriteria(achievementId: Text): Validate achievement criteria
// claimReward(achievementId: Text): Claim reward for completed achievement
// getAvailableRewards(): List available rewards
// checkEligibility(rewardId: Text): Check eligibility for specific reward

// Analysis Endpoints
// getUserActivity(timeframe: Timeframe): Analyze user activity patterns
// getInteractionMetrics(): Get AI interaction metrics
// getEngagementScore(): Calculate user engagement score
// getPremiumUsageStats(): Analyze premium feature usage
// getPopularAvatar(): Analyze most used avatar

// Transaction Endpoints ( premium plan bisa membayar dengan token icp juga)
// initiatePayment(amount: Nat, currency: Text): Start payment process
// processICPPayment(paymentData: PaymentDetails): Process ICP payment
// verifyPayment(paymentId: Text): Verify payment completion
// refundPayment(paymentId: Text): Process refund
// getTransactionHistory(filter: TransactionFilter): Get transaction history
// getPaymentStatus(paymentId: Text): Check payment status
// generateInvoice(transactionId: Text): Generate invoice
// calculateFees(amount: Nat): Calculate transaction fees

// Level Endpoints ( Level 1, Level 2, Level 3, Level 4, Lavel 5 untuk kemajuan user dari achievement yang didapat dan keaktifan user dalam chatting di ai kita)
// getCurrentLevel(userId: Principal): Get user's current level
// calculateExperience(actions: [Action]): Calculate experience points
// upgradeLevelStatus(): Check and upgrade level if eligible
// getLevelRequirements(level: Nat): Get requirements for specific level
// getProgressToNextLevel(): Get progress towards next level
// getLevelHistory(): Get user's level progression history
// unlockLevelFeatures(level: Nat): Unlock features for current level
// checkLevelPrivileges(): Check available privileges for current level
