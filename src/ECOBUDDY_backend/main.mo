import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";
import IcpLedger "canister:icp_ledger_canister";

import Types "types/Types";
import UserService "services/UserService";
import AiService "services/AiService";
import ExpService "services/ExpService";
import LevelandAchievementService "services/LevelandAchievementService";
import TransactionService "services/TransactionService";

actor class EcoBuddy() = this {
  stable var ecobuddyPrincipal : Principal = Principal.fromActor(this);

  Debug.print(debug_show (ecobuddyPrincipal));

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

  private var userBalances: Types.UserBalances = HashMap.HashMap<Principal, Types.UserBalance>(
    10,
    Principal.equal,
    Principal.hash,
  );

  // fun talker achievement
  stable var EmojiCount = 0;

  // knowledge seeker achievement
  stable var messageCount : Nat = 0;

  // curious starter achievement
  stable var questionCount : Nat = 0;

  public type AchievementList = {
    #Conversation_Starter;
    #Fun_Talker;
    #Curious_Starter;
    #Knowledge_Spreader;
  };

  stable var AchievementCollected : [Text] = [];

  // DATA ENTRIES
  stable var usersEntries : [(Principal, Types.User)] = [];
  stable var userLevelEntries : [(Principal, Types.LevelDetail)] = [];
  stable var messageRecordsEntries : [(Text, Types.Message)] = [];
  stable var avatarListEntries : [(Text, Types.Avatar)] = [];
  stable var userBalancesEntries : [(Principal, Types.UserBalance)] = [];

  // PREUPGRADE & POSTUPGRADE FUNC TO KEEP DATA
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    userLevelEntries := Iter.toArray(userLevel.entries());
    messageRecordsEntries := Iter.toArray(messageRecords.entries());
    avatarListEntries := Iter.toArray(avatarList.entries());
    userBalancesEntries := Iter.toArray(userBalances.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    userLevel := HashMap.fromIter<Principal, Types.LevelDetail>(userLevelEntries.vals(), 0, Principal.equal, Principal.hash);
    messageRecords := HashMap.fromIter<Text, Types.Message>(messageRecordsEntries.vals(), 0, Text.equal, Text.hash);
    avatarList := HashMap.fromIter<Text, Types.Avatar>(avatarListEntries.vals(), 0, Text.equal, Text.hash);
    userBalances := HashMap.fromIter<Principal, Types.UserBalance>(userBalancesEntries.vals(), 0, Principal.equal, Principal.hash);

    usersEntries := [];
    userLevelEntries := [];
    messageRecordsEntries := [];
    avatarListEntries := [];
    userBalancesEntries := [];
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

  public shared (msg) func updateUser(data : Types.UserUpdateProfile) : async Result.Result<Types.User, Text> {
    return await UserService.updateUser(users, msg.caller, data);
  };

  // AI RESPONSE ------------------------------------------------------------------- AI RESPONSE
  var passAnswer : Text = "";

  public func askBot(input : Text, userId : Principal) : async Result.Result<Types.ResponseAI, Text> {

    let res = await AiService.httpReq(input, passAnswer);
    let generatedUUID = AiService.generateUUID();
    let userData = users.get(userId);

    switch (userData) {
      case (null) { #err("User not found") };
      case (?currentUser) {
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

                let _ = await checkAchievement(userId, currentUser, result.solution, input);

                #ok final;
              };
            };

          };
        };
      };
    };
  };
  // ACHIEVEMENT

  // EXP POINT ------------------------------------------------------------------- EXP POINT
  public func addExp(expPoint : Nat, userId : Principal) : async Result.Result<Nat, Text> {
    return await ExpService.addExpToChain(expPoint, userId, users);
  };

  public func getTotalExp(userId : Principal) : async Result.Result<Nat, Text> {
    return await ExpService.totalExp(userId, users);
  };

  // LEVEL & ACHIEVEMENT-------------------------------------------------------------------- LEVEL & ACHIEVEMENT
  public func getUserLevelDetail(userId : Principal) : async Result.Result<Types.LevelDetail, Text> {
    return await LevelandAchievementService.handleGetUserLevelDetail(userId, userLevel);
  };

  public func upgradeLevel(level : Nat, userId : Principal) : async Result.Result<Types.LevelDetail, Text> {
    return await LevelandAchievementService.handleUpgradeLevel(level, userId, userLevel, users);
  };

  // RUN THIS FUNCTION WHEN CANISTER IS DEPLOYED
  public func addAvatar() : async Text {
    return await LevelandAchievementService.handleAddAvatar(avatarList);
  };

  public func unlockAvatar(level : Nat, userId : Principal) : async Result.Result<Text, Text> {
    return await LevelandAchievementService.handleUnlockAvatar(level, userId, users, avatarList);
  };

  private func getAchievement(userId : Principal) : async Bool {
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

  public func checkAchievement(userId : Principal, currentUser : Types.User, solution : Text, input : Text) : async Bool {
    var achievements : [Text] = [];
    let achievementResult = await getAchievement(userId);

    if (achievementResult) {
      // CONVERSATION STARTER ACHIEVEMENT
      if (Array.find<Text>(AchievementCollected, func(x) { x == "Fun_Talker" }) == null) {
        let conversation_starter_result = await unlockAchievement("Conversation_Starter", userId);
        switch (conversation_starter_result) {
          case (#err(_)) {};
          case (#ok(value)) {
            achievements := Array.append(achievements, [value]);
          };
        };
      };

      // FUN TALKER ACHIEVEMENT
      if ((Text.contains(solution, #text "🌱") or Text.contains(solution, #text "🌍")) and EmojiCount != 5) {
        EmojiCount += 1;
      };

      if (EmojiCount >= 5 and Array.find<Text>(AchievementCollected, func(x) { x == "Fun_Talker" }) == null) {
        let fun_talker_result = await unlockAchievement("Fun_Talker", userId);
        switch (fun_talker_result) {
          case (#err(_)) {};
          case (#ok(value)) {
            achievements := Array.append(achievements, [value]);
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
          };
        };
      };

      // update users type
      let updatedUser = {
        id = currentUser.id;
        walletAddress = currentUser.walletAddress;
        username = currentUser.username;
        achievements = achievements;
        expPoints = currentUser.expPoints;
        level = currentUser.level;
        avatar = currentUser.avatar;
        profile = currentUser.profile;
      };

      users.put(userId, updatedUser);

      return true;
    } else {
      return false;
    };
  };

  public func unlockAchievement(AchievementType : Text, userId : Principal) : async Result.Result<Text, Text> {
    return await LevelandAchievementService.handleUnlockAchievement(AchievementType, userId, users);
  };

  // TRANSACTION & WALLET ------------------------------------------------------------------- TRANSACTION & WALLET
  // get canister id
  public query func getPrincipalId() : async Principal {
    return Principal.fromActor(this);
  };

  // get canister principal
  public query func getEcobuddyPrincipal() : async Principal {
    return ecobuddyPrincipal;
  };

  // get account balance
  public func getAccountBalance(userId : Principal) : async Types.UserBalance {
    return await TransactionService.handleGetAccountBalance(userId, userBalances);
  };

  public func transferICP(
    from : Principal,
    to : Principal,
    amount : Nat64,
  ) : async Result.Result<IcpLedger.BlockIndex, Text> {
    return await TransactionService.handleTransferICP(from, to, amount, userBalances);
  };
};
