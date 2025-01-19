actor EcoBuddy {

  // User Endpoints
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

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
