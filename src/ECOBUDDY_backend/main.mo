import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import JSON "mo:json";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Bool "mo:base/Bool";

import UserService "services/UserService";
import AiService "services/AiService";
import DailyQuest "services/DailyQuest";
import DailyQuiz "services/DailyQuiz";
import ExpService "services/ExpService";
import LevelandAchievementService "services/LevelandAchievementService";

import Types "types/Types";


actor EcoBuddy {
  // DATA
  private var users : Types.Users = HashMap.HashMap<Principal, Types.User>(
    10,
    Principal.equal,
    Principal.hash,
  );
  private var dailyQuests : Types.DailyQuests = HashMap.HashMap<Principal, Types.DailyQuest>(
    10,
    Principal.equal,
    Principal.hash,
  );
  private var dailyQuizs : Types.DailyQuizs = HashMap.HashMap<Principal, Types.DailyQuiz>(
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
  private stable var dailyQuestsEntries : [(Principal, Types.DailyQuest)] = [];
  private stable var dailyQuizsEntries : [(Principal, Types.DailyQuiz)] = [];

  // PREUPGRADE & POSTUPGRADE FUNC TO KEEP DATA
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    dailyQuestsEntries := Iter.toArray(dailyQuests.entries());
    dailyQuizsEntries := Iter.toArray(dailyQuizs.entries());
  };
  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
    dailyQuests := HashMap.fromIter<Principal, Types.DailyQuest>(dailyQuestsEntries.vals(), 0, Principal.equal, Principal.hash);
    dailyQuestsEntries := [];
    dailyQuizs := HashMap.fromIter<Principal, Types.DailyQuiz>(dailyQuizsEntries.vals(), 0, Principal.equal, Principal.hash);
    dailyQuizsEntries := [];
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

  // AI ------------------------------------------------------------------- AI
  var passAnswer : Text = "";

  public func askBot(input : Text, userId : Principal) : async Result.Result<Types.ResponseAI, Text> {
    let res = await AiService.httpReq(input, passAnswer);
    let generatedUUID = AiService.generateUUID();
    let userData = users.get(userId);

    switch (userData) {
      case (null) { #err("User not found") };
      case (?currentUser) {
        switch (res) {
          case(#err(s)) { 
            passAnswer := "";
            #err s 
          };
          case (#ok(result)) {
            // ADD QUEST
            let userDailyQuest = await DailyQuest.addChatCount(userId, dailyQuests);
            let expQuest = switch(userDailyQuest){
              case(#ok(userDailyQuestValid)){
                if(userDailyQuestValid.chatCount == 10){ 20 }else{ 0 }
              };
              case (_){
                0
              };
            };
            
            // ADD USER EXP
            let addUserEXP = await addExp(Int.abs(result.exp + expQuest), userId);
            switch (addUserEXP) {
              case (#err(_)) { #err("Error Adding User EXP") };
              case (#ok(expOk)) {
                passAnswer := result.solution;
                let final = {
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

  public func askQuiz(theme : Text) : async Result.Result <Text, Text> {
    let res = await AiService.askQuiz(theme);
    res;
  };

  // DAILY QUEST ------------------------------------------------------------------- DAILY QUEST
  public func checkDailyQuest(userId : Principal, date : Text) : async Result.Result<Types.DailyQuest, Text> {
    let currentQuest = DailyQuest.checkDailyQuest(userId, dailyQuests, date);
    switch(currentQuest){
      case(#err(t)){
        Debug.print(debug_show(t));
        return currentQuest;
      };
      case(#ok(validData)){
        if(validData.login){
          // IF LOGIN, RETURN DATA
          Debug.print(debug_show("User allready login this day")); 
          return currentQuest;
        }else{
          // IF NOT LOGIN, ADD EXP 20 TO USER
          let _exp = addExp(20, userId);
          let newData = {
            login = true;
            date = validData.date;
            chatCount = validData.chatCount;
            quizCount = validData.quizCount;
          };
          return #ok newData;
        };
      };
    };
  };

  // DAILY QUIZZ ------------------------------------------------------------------- DAILY QUIZZ
  public shared func getDailyQuizs (userId : Principal, date : Text, id1 : Text, id2 : Text, id3 : Text ) : async Result.Result<Types.DailyQuiz, Text> {
    let userQuiz = await DailyQuiz.getDailyQuizs(userId, date, dailyQuizs, id1, id2, id3);
    switch(userQuiz){
      case (#ok (valid)){
        #ok valid;
      };
      case(#err(t)){
        #err t
      };
    };
  };

  public shared func submitDailyQuiz (userId : Principal, id : Text, exp : Text) : async Result.Result<Types.DailyQuiz, Text>{
    let userQuiz = await DailyQuiz.submitDailyQuiz(userId, id, dailyQuizs);
    
    switch(userQuiz){
      case (#ok (valid)){
        let expUser = switch(Nat.fromText(exp)){
          case (?isNat){
            isNat
          };
          case (null){
            0
          };
        };
        let addExpUser = await addExp(expUser, userId);
        Debug.print(debug_show(addExpUser));
        #ok valid;
      };
      case(#err(t)){
        #err t
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
    }
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
  // public func getUserBalance(userId: Principal): async Nat {

  // };
};

