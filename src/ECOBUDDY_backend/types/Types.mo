import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Bool "mo:base/Bool";

module {
  public type Users = HashMap.HashMap<Principal, User>;
  public type Messages = HashMap.HashMap<Text, Message>;
  public type Avatars = HashMap.HashMap<Text, Avatar>;
  public type UserBalances = HashMap.HashMap<Principal, UserBalance>;
  public type LevelDetails = HashMap.HashMap<Principal, LevelDetail>;
  public type DailyQuests = HashMap.HashMap<Principal, DailyQuest>;
  public type DailyQuizs = HashMap.HashMap<Principal, DailyQuiz>;

  // USER TYPE
  public type User = {
    id : Principal;
    username : Text;
    level : Nat;
    walletAddress : Text;
    expPoints : Nat;
    achievements : [Text];
    avatar : Text;
    profile: Text;
  };

  public type UserBalance = {
    id : Principal;
    balance : Nat;
    total_transaction: Nat;
  };

  public type UserUpdateProfile = {
    username : ?Text;
    profile : ?Text;
  };

  // DAILY QUEST
  public type DailyQuest = {
    date : Text;
    login : Bool;
    chatCount : Nat;
    quizCount : Nat;
  };

  // DAILY QUIZ
  public type DailyQuiz = {
    date : Text;
    quizNum1 : Text;
    quizNum2 : Text;
    quizNum3 : Text;
    statQuizNum1 : Bool;
    statQuizNum2 : Bool;
    statQuizNum3 : Bool;
  };
  
  // AI TYPE
  public type ResponseAI = {
    solution : Text;
    exp : Nat;
  };

  public type ResponseQuiz = {
    questions : [
      {
        question : Text;
        options : [Text];
        answer : Text;
        reason : Text
      }
    ];
  };
  
  // CHAT RECORD AND HISTORY TYPE

  public type Message = {
    id : Text;
    sender : Principal;
    content : Text;
    timestamp : Int;
    messageType : MessageType;
  };

  // Enum untuk tipe pesan
  public type MessageType = {
    #UserMessage;
  };

  // LEVEL TYPES
  public type LevelDetail = {
    userId : Principal;
    avatar : Avatar;
    nextLevel : Nat;
    expToNextLevel : Nat;
    currentExp : Nat;
  };

  public type AchievementResponse = {
    id : Text;
    name : Text;
    description : Text;
    badge : Text;
    claimedAt : Int;
  };

  // AVATAR TYPES
  public type Avatar = {
    name : Text;
    avatar : Text;
    createdAt : Int;
  };
};
