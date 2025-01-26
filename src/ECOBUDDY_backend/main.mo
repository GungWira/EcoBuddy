import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import JSON "mo:json";
import Nat "mo:base/Nat";


import Types "types/Types";
import UserService "services/UserService";

import IC "ic:aaaaa-aa";
import Cycles "mo:base/ExperimentalCycles";
import Blob "mo:base/Blob";

actor EcoBuddy {
  // DATA
  private var users : Types.Users = HashMap.HashMap(
    10,
    Principal.equal,
    Principal.hash,
  );
  private var expPoint : Nat = 0;
  private var creativityPoint : Nat = 0;
  private var practicalityPoint : Nat = 0;
  private var environmentalImpactPoint : Nat = 0;
  private var totalExp : Nat = 0;

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
    return UserService.createUser(users, msg.caller, walletAddress);
  };

  public query func getUserById(userId : Principal) : async ?Types.User {
    return users.get(userId);
  };

  public shared (msg) func updateUser(username : Text) : async Result.Result<Types.User, Text> {
    return UserService.updateUser(users, msg.caller, username);
  };

  // AI RESPONSE ------------------------------------------------------------------- AI RESPONSE
  public query func transform({
    context : Blob;
    response : IC.http_request_result;
  }) : async IC.http_request_result {
    {
      response with headers = []; // not intersted in the headers
    };
  };

  //PULIC METHOD
  var passAnswer : Text = "";
  public func askBot(input : Text) : async Text {
    let _host : Text = "generativelanguage.googleapis.com";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCOwAtmAGerXSaOM2281sBtplJ_f3c3TRY"; //HTTP that accepts IPV6

    let idempotency_key : Text = generateUUID();
    let request_headers = [
      { name = "User-Agent"; value = "POST_USER_COMMAND" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    let request_body_json : Text = "{ \"contents\": [ { \"parts\": [ { \"text\": \"Berikut adalah sebuah pesan dalam percakapan antara pengguna dan AI yang membahas topik lingkungan, khususnya pengelolaan sampah maupun kesehatan lingkungan. Fokus percakapan adalah pada prompt berikut: "# input #"\\n\\n User juga sebelumnya mendapatkan jawaban ini dari anda : "#passAnswer#"\\n\\n Anda bernama EcoBot, seorang personal asisten yang akan membantu user menjadi lebih baik dari segi pehamana lingkungan dan menuju dunia lebih bersih. Tugas Anda adalah memberikan evaluasi atau jawaban terhadap prompt tersebut dan memberikan respons dalam format JSON string yang valid, tanpa karakter tambahan seperti ```json atau ```. yang telah ditentukan. Pastikan untuk menyertakan:\\n\\n 1. Jika input tidak relevan dengan topik lingkungan atau isu sampah plastik (contoh: sapaan sederhana seperti \\\"halo\\\", \\\"apa kabar\\\", atau \\\"selamat pagi\\\"), berikan respons singkat berikut:\\n { \\\"response\\\": { \\\"solution\\\": \\\"Jawaban singkat juga kepada pengguna, dan silahkan tambahkan hooks atau umpan balik ke pengguna berupa pertanyaan singkat saja, misal jika user hanya menyapa maka silahkan sapa balik dan tanyakan seperti ingin berbuat baik tentnag lingkungan apa sekarang, dan sejenisnya anda bisa lakukan improvisasi disini\\\", \\\"expAmmount\\\": { \\\"point\\\": 0 } } }\\n\\n 2. Jika input relevan, jawab pertanyaan pengguna dengan singkat saja, pastikan gunakan bahasa yang ramah dan tidak terlalu baku, seperti anda berbicara dengan anak-anak, selalu ingat memberi umpan balik di akhir jawaban. Anda bisa menyertakan solusi atau ide praktis yang dapat diterapkan oleh pengguna terkait pertanyaan tersebut, seperti:\\n - Menjelaskan konteks atau latar belakang terkait isu sampah plastik.\\n - Memberikan metode yang dapat diterapkan dengan langkah-langkah rinci.\\n - Mengintegrasikan pendekatan kreatif, tradisional, dan berbasis kolaborasi komunitas jika memungkinkan.\\n - Menjelaskan dampak positif dari solusi, baik untuk individu maupun lingkungan.\\n - Membahas hasil jangka pendek dan panjang dari penerapan solusi.\\n - Mengulas realisme solusi, termasuk potensi tantangan dan cara mengatasinya.\\n - Menyertakan tips, alat, atau referensi tambahan yang relevan.\\n\\n Penilaian dampak positif terhadap lingkungan: Spekulasi tentang dampak implementasi solusi terhadap pengurangan sampah plastik, edukasi masyarakat, atau keterlibatan komunitas lokal.\\n Tinjau potensi pengurangan sampah plastik, inspirasi bagi orang lain, dan mendorong perubahan perilaku masyarakat.\\n\\n Penilaian realisme: Tinjau apakah solusi tersebut realistis untuk diterapkan oleh pengguna rata-rata dengan sumber daya terbatas. Pertimbangkan kesulitan teknis, biaya, waktu, dan keahlian yang dibutuhkan.\\n\\n Penilaian menariknya pertanyaan: Nilai potensi pertanyaan ini untuk memotivasi diskusi atau inovasi lebih lanjut terkait pengelolaan sampah plastik.\\n\\n Penambahan 'experience points' (EXP): Evaluasi dan berikan jumlah EXP kepada pengguna berdasarkan kriteria berikut:\\n - 25 EXP: Pertanyaan sangat spesifik, relevan, proaktif, dan kreatif.\\n - 15 EXP: Pertanyaan cukup spesifik dan relevan, namun kurang proaktif atau kreatif.\\n - 5 EXP: Pertanyaan umum tentang lingkungan.\\n - 0 EXP: Pertanyaan tidak relevan atau tidak memberikan kontribusi pada diskusi.\\n\\n Berikut adalah format respons dalam JSON STRING yang harus digunakan (jangan menambahkan informasi di luar format ini):\\n\\n { \\\"response\\\": { \\\"solution\\\": \\\"Jawaban komprehensif yang mencakup semua aspek yang diminta.\\\", \\\"expAmmount\\\": { \\\"point\\\": \\\"jumlah total EXP berdasarkan evaluasi di atas (0, 5, 15, 25).\\\" } } }\\n\\n Jika anda ingin memberikan highlight pada satu judul atau apapun itu, jangan gunakan tanda seperti ** atau sejenisnya, \" } ] } ] }";
    
    let request_body = Text.encodeUtf8(request_body_json);

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = null;
      headers = request_headers;
      body = ?request_body;
      method = #post;
      transform = ?{
        function = transform;
        context = Blob.fromArray([]);
      };
    };

    Cycles.add<system>(230_850_258_000);

    let http_response : IC.http_request_result = await IC.http_request(http_request);

    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) { "No value returned" };
      case (?y) { y };
    };

    switch(JSON.parse(decoded_text)){
      case(#err(e)){
        Debug.print("Parse error: " # debug_show(e));
        "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
      };
      case (#ok(data)){
        // Debug.print(debug_show(data));
        switch(JSON.get(data, "candidates[0].content.parts[0].text")){
          case (null){
            Debug.print("Field tidak ditemukan");
            "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
          };
          case (?jsonString){
            switch(jsonString){
              case(#String(jsonText)){
                switch (JSON.parse(jsonText)){
                  case(#err(e)){
                    Debug.print("Parse error: " # debug_show(e));
                    "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
                  };
                  case (#ok(parsedJson)) {
                    let solution = switch (JSON.get(parsedJson, "response.solution")) {
                      case (null) { "Solution not found" };
                      case (?value) {
                        switch (value) {
                          case (#String(s)) { s }; // Convert JSON string to Text
                          case _ { "Invalid Solution format" }; // In case it's not a string
                        };
                      };
                    };
                    let exp : Text = switch (JSON.get(parsedJson, "response.expAmmount.point")) {
                      case (null) { "Exp not found" };
                      case (?value) {
                        switch (value) {
                          case (#String(s)) { s }; // Convert JSON string to Text
                          case _ { "Invalid exp format" }; // In case it's not a string
                        };
                      };
                    };
                    let creativity : Text = switch (JSON.get(parsedJson, "response.exp_details.creativity.point")) {
                      case (null) { "Creative point not found" };
                      case (?value) {
                        switch (value) {
                          case (#String(s)) { s }; // Convert JSON string to Text
                          case _ { "Invalid exp format" }; // In case it's not a string
                        };
                      };
                    };
                    let practicality : Text = switch (JSON.get(parsedJson, "response.exp_details.practicality.point")) {
                      case (null) { "Exp not found" };
                      case (?value) {
                        switch (value) {
                          case (#String(s)) { s }; // Convert JSON string to Text
                          case _ { "Invalid exp format" }; // In case it's not a string
                        };
                      };
                    };
                    var environmentalImpact : Text = switch (JSON.get(parsedJson, "response.exp_details.environmental_impact.point")) {
                      case (null) { "Exp not found" };
                      case (?value) {
                        switch (value) {
                          case (#String(s)) { s }; // Convert JSON string to Text
                          case _ { "Invalid exp format" }; // In case it's not a string
                        };
                      };
                    };

                    Debug.print("Solution: " # solution);
                    Debug.print("Experience Points: " # exp);

                    expPoint := switch (Nat.fromText(exp)) {
                      case (?n) { n };
                      case (null) { 0 };
                    };
                    practicalityPoint := switch (Nat.fromText(practicality)) {
                      case (?n) { n };
                      case (null) { 0 };
                    };
                    creativityPoint := switch (Nat.fromText(creativity)) {
                      case (?n) { n };
                      case (null) { 0 };
                    };
                    environmentalImpactPoint := switch (Nat.fromText(environmentalImpact)) {
                      case (?n) { n };
                      case (null) { 0 };
                    };

                    totalExp += expPoint;

                    solution;
                  };
                };
              };
              case _ {
                Debug.print("'c' is not a string");
                "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
              }
            };
          };
        };
      };
    };
  };

  func generateUUID() : Text {
    "UUID-123456789";
  };

  // EXP POINT ------------------------------------------------------------------- EXP POINT
  public func addExp(expPoint : Nat, userId : Principal) : async Result.Result<Nat, Text> {
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

        // return exp ammound
        #ok(currentUser.expPoints);
      };
    };
  };

  public func getTotalExp(userId : Principal) : async Result.Result<Nat, Text> {
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
        #ok(currentUser.expPoints);
      };
    };
  };

  // LEVEL ------------------------------------------------------------------- LEVEL

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
