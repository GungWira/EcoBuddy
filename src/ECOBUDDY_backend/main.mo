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

import Time "mo:base/Time";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
import LevelandAchievementService "services/LevelandAchievementService";


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

  public shared (msg) func updateUser(data: Types.UserUpdateProfile) : async Result.Result<Types.User, Text> {
    return await UserService.updateUser(users, msg.caller, data);
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
    }
  };

  public func unlockAchievement(AchievementType : Text, userId : Principal) : async Result.Result<Text, Text> {
    return await LevelandAchievementService.handleUnlockAchievement(AchievementType, userId, users);
  };

  // TRANSACTION & WALLET ------------------------------------------------------------------- TRANSACTION & WALLET
  // public func getUserBalance(userId: Principal): async Nat {

  // };
};