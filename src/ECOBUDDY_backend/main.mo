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
import Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";
import LevelandAchievementService "services/LevelandAchievementService";
import IcpLedger "canister:icp_ledger_canister";

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

  let userBalances = HashMap.HashMap<Principal, Types.UserBalance>(
    10,
    Principal.equal,
    Principal.hash,
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
  // ICP transfer function
  private func manageUserBalance(
    userBalances : Types.UserBalances,
    userId : Principal,
    amount : Nat,
    operation : { #increment; #decrement },
  ) : Result.Result<(), Text> {
    // function to create new balance record
    func createNewBalance(amt : Nat) : Types.UserBalance {
      {
        id = userId;
        balance = amt;
        total_transaction = 0;
      }
    };

    // function to update existing balance
    func updateBalance(current : Types.UserBalance, amt : Nat, isDecrease : Bool) : Types.UserBalance {
      {
        id = current.id;
        balance = if (isDecrease) Nat.sub(current.balance, amt) else current.balance + amt;
        total_transaction = if (isDecrease) current.total_transaction + amt else current.total_transaction;
      }
    };

    let currentBalance = userBalances.get(userId);

    switch (currentBalance, operation) {
      case (null, #decrement) #err("No balance found for user");
      case (?balance, #decrement) {
        if (balance.balance < amount) {
          #err("Balance insufficient for transaction")
        } else {
          userBalances.put(userId, updateBalance(balance, amount, true));
          #ok()
        }
      };
      case (null, #increment) {
        userBalances.put(userId, createNewBalance(amount));
        #ok()
      };
      case (?balance, #increment) {
        userBalances.put(userId, updateBalance(balance, amount, false));
        #ok()
      };
    }
  };

  public func getAccountBalance(userId : Principal) : async Types.UserBalance {
    let balance = userBalances.get(userId);
    switch (balance) {
      case (null) {
        return {
          id = userId;
          balance = 0;
          total_transaction = 0;
        };
      };
      case (?value) {
        return value;
      };
    };
  };


  public func transferICP(
    from : Principal,
    to : Principal,
    amount : Nat64,
  ) : async Result.Result<IcpLedger.BlockIndex, Text> {
    // Check minimum transfer amount
    if (amount < 2_000) {
      return #err("Transfer amount too small. Minimum is 2_000 e8s");
    };

    // Get account balances
    let fromBalance = await getAccountBalance(from);
    if (fromBalance.balance < Nat64.toNat(amount)) {
      return #err("Insufficient balance");
    };

    // Update internal balances
    let fromBalanceResult = manageUserBalance(userBalances, from, Nat64.toNat(amount), #decrement);
    let toBalanceResult = manageUserBalance(userBalances, to, Nat64.toNat(amount), #increment);

    switch (fromBalanceResult, toBalanceResult) {
      case (#err(e), _) { return #err(e) };
      case (_, #err(e)) { return #err(e) };
      case (#ok(_), #ok(_)) {
        let accountIdentifier = await IcpLedger.account_identifier({
          owner = to;
          subaccount = null;
        });

        let transferArgs : IcpLedger.TransferArgs = {
          to = accountIdentifier;
          memo = 0;
          amount = { e8s = amount };
          fee = { e8s = 10_000 };
          from_subaccount = null;
          created_at_time = null;
        };

        Debug.print("Initiating transfer to: " # debug_show(to));
        Debug.print("Amount: " # debug_show(amount));

        let transferResult = await IcpLedger.transfer(transferArgs);
        switch (transferResult) {
          case (#Err(transferError)) {
            Debug.print("Transfer failed: " # debug_show(transferError));
            return #err("Transfer failed: " # debug_show(transferError));
          };
          case (#Ok(blockIndex)) {
            Debug.print("Transfer successful. Block index: " # debug_show(blockIndex));
            return #ok(blockIndex);
          };
        };
      };
    };
  };
};
