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

import Debug "mo:base/Debug";

actor EcoBuddy {
  // DATA
  private var users : Types.Users = HashMap.HashMap<Principal, Types.User>(
    10,
    Principal.equal,
    Principal.hash,
  );

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

  public shared (msg) func updateUser(username : Text) : async Result.Result<Types.User, Text> {
    return UserService.updateUser(users, msg.caller, username);
  };

  // AI RESPONSE ------------------------------------------------------------------- AI RESPONSE
  var passAnswer : Text = "";

  public func askBot(input : Text, userId : Principal) : async Result.Result<Types.ResponseAI, Text> {
    let res = await AiService.httpReq(input, passAnswer);

    switch(res){
      case(#err(s)) { #err s };
      case(#ok(result)) {

        let addUserEXP = await addExp(Int.abs(result.exp), userId);
        switch(addUserEXP){
          case(#err(t)) {#err ("Error Adding User EXP")};
          case(#ok(expOk)) {
            let final = {
              solution = result.solution;
              exp = expOk;
            };
            #ok final;
          }
        };

      };
    }
  };

  // EXP POINT ------------------------------------------------------------------- EXP POINT
  public shared func addExp(expPoint : Nat, userId : Principal) : async Result.Result<Nat, Text> {
    // auth
    if (Principal.isAnonymous(userId)) {
      return #err("Anonymous principals are not allowed");
    };

    // query data
    let user = users.get(userId);

    // validate if exists
    switch (user) {
      case(null) {
        #err("User not found");
      };
      case (?currentUser) {

        let updatedUser : Types.User = {
          id = currentUser.id;
          username = currentUser.username;
          level = currentUser.level;
          walletAddress = currentUser.walletAddress;
          expPoints = currentUser.expPoints + expPoint;
        };

        // update data exp
        users.put(userId, updatedUser);

        // return exp amount
        #ok(currentUser.expPoints + expPoint);
      };
    };
  };

  public shared (msg) func getTotalExp() : async Result.Result<Nat, Text> {
    // auth
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous principals are not allowed");
    };

    // query data
    let user = users.get(msg.caller);

    // validate if exists
    switch (user) {
      case(null) {
        #err("User not found");
      };
      case (?currentUser) {
        #ok(currentUser.expPoints);
      };
    };
  };

  // // LEVEL ------------------------------------------------------------------- LEVEL
  // public func getProgressToNextLevel() {

  // };

  // public func getCurrentLevel(userId: Principal) {

  // };

  // public func upgradeLevelStatus() {

  // };

  // public func getLevelRequirements(level: Nat) {

  // };

  // public func unlockAvatar(level: Nat) {

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
};
