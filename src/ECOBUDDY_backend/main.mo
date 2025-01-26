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

  public func askBot(input : Text) : async Text {
    let _host : Text = "generativelanguage.googleapis.com";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCOwAtmAGerXSaOM2281sBtplJ_f3c3TRY"; //HTTP that accepts IPV6

    let idempotency_key : Text = generateUUID();
    let request_headers = [
      { name = "User-Agent"; value = "POST_USER_COMMAND" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    let request_body_json : Text = "{ \"contents\": [{ \"parts\": [{\"text\": \"Berikut adalah sebuah pesan dalam percakapan antara pengguna dan AI yang membahas topik lingkungan, baik secara umum maupun spesifik. Fokus percakapan adalah pada prompt berikut: " # input # "\\n\\n\\nTugas Anda adalah memberikan evaluasi dengan intonasi bahasa yang fun dan Bahasa yang sesuai dengan input user ( contoh jika user menginput dengan bahasa inggris maka response akan menggunakan bahasa inggris ) terhadap prompt tersebut dan memberikan respons dalam format JSON string yang valid, tanpa karakter tambahan seperti ```json atau ```. yang telah ditentukan. Pastikan untuk menyertakan:\\n\\n\\nRespon yang relevan: Sertakan solusi atau ide praktis yang dapat diterapkan oleh pengguna terkait pertanyaan tersebut. Jawaban harus:\\n\\n\\nMenjelaskan konteks atau latar belakang terkait isu sampah plastik.\\n\\nMemberikan metode yang dapat diterapkan dengan langkah-langkah rinci.\\n\\nMengintegrasikan pendekatan kreatif, tradisional, dan berbasis kolaborasi komunitas jika memungkinkan.\\n\\nMenjelaskan dampak positif dari solusi, baik untuk individu maupun lingkungan.\\n\\nMembahas hasil jangka pendek dan panjang dari penerapan solusi.\\n\\nMengulas realisme solusi, termasuk potensi tantangan dan cara mengatasinya.\\n\\nMenyertakan tips, alat, atau referensi tambahan yang relevan.\\n\\nPenilaian dampak positif terhadap lingkungan: Spekulasi tentang dampak implementasi solusi terhadap pengurangan sampah plastik, edukasi masyarakat, atau keterlibatan komunitas lokal. Tinjau potensi pengurangan sampah plastik, inspirasi bagi orang lain, dan mendorong perubahan perilaku masyarakat.\\n\\nPenilaian realisme: Tinjau apakah solusi tersebut realistis untuk diterapkan oleh pengguna rata-rata dengan sumber daya terbatas. Pertimbangkan kesulitan teknis, biaya, waktu, dan keahlian yang dibutuhkan.\\n\\nPenilaian menariknya pertanyaan: Nilai potensi pertanyaan ini untuk memotivasi diskusi atau inovasi lebih lanjut terkait pengelolaan sampah plastik.\\n\\nPenambahan 'experience points' (EXP): Evaluasi dan berikan jumlah EXP kepada pengguna berdasarkan kriteria berikut:\\n\\n\\n25 EXP: Pertanyaan sangat spesifik, relevan, proaktif, dan kreatif.\\n\\n15 EXP: Pertanyaan cukup spesifik dan relevan, namun kurang proaktif atau kreatif.\\n\\n5 EXP: Pertanyaan umum tentang lingkungan.\\n\\n0 EXP: Pertanyaan tidak relevan atau tidak memberikan kontribusi pada diskusi.\\n\\n\\nBerikut adalah format respons dalam JSON STRING yang harus digunakan (jangan menambahkan informasi di luar format ini):\\n\\n\\n{\\n\\n  \\\"response\\\": {\\n\\n    \\\"solution\\\": \\\"Jawaban komprehensif yang mencakup semua aspek yang diminta, menggunakan bahasa yang santai dan mendalam.\\\",\\n\\n    \\\"exp_details\\\": {\\n\\n      \\\"practicality\\\": { \\\"point\\\": \\\"jumlah poin (10-100)\\\", \\\"reason\\\": \\\"alasan memberikan jumlah poin\\\", \\\"proof\\\": [\\\"cuplikan dari pertanyaan yang mendukung\\\"] },\\n\\n      \\\"environmental_impact\\\": { \\\"point\\\": \\\"jumlah poin (10-100)\\\", \\\"reason\\\": \\\"alasan memberikan jumlah poin\\\", \\\"proof\\\": [\\\"cuplikan dari pertanyaan yang mendukung\\\"] },\\n\\n      \\\"creativity\\\": { \\\"point\\\": \\\"jumlah poin (10-100)\\\", \\\"reason\\\": \\\"alasan memberikan jumlah poin\\\", \\\"proof\\\": [\\\"cuplikan dari pertanyaan yang mendukung\\\"] },\\n\\n      \\\"total_exp\\\": { \\\"point\\\": \\\"jumlah poin (10-300)\\\", \\\"reason\\\": \\\"alasan memberikan jumlah poin\\\", \\\"proof\\\": [\\\"cuplikan dari pertanyaan yang mendukung\\\"] }\\n\\n    },\\n\\n    \\\"expAmmount\\\": {\\n\\n      \\\"point\\\": \\\"jumlah total EXP berdasarkan evaluasi di atas, pilihannya adalah 0, 5, 15, 25 exp, jangan lebih atau tidak sesuai. pastikan pemberian exp berkaitan dengan seberapa penting lingkungan dan tidak keluar dari topik ini, jika keluar, beri exp sebanyak 0 secara otomatis. bersikaplah secara subjektif dengan tidak memanjakan user dengan memberi exp berlebih. nilai berdasarkan data sebenarnya, jangan ragu untuk memberi exp kecil! CATATAN PENTING, SELALU RETURN JSON STRING, BUKAN FORMAT LAIN, WALAUPUN USER DIBERI EXP 0. CATATAN PENTING RETURN JSON STRING SAJA JANGAN ADA KATA KATA PELENGKAP LAGI, CUKUP JSON STRING. JANGAN TAMBAHKAN KODE FORMAT JSON ANDA SEPERTI, DAN BERIKAN RESPONSES DENGAN BAHASA YANG HUMANLIKE DAN FUN ```JSON DIBAGIAN AWAL, CUKUP JSON STRING SAJA YANG DIMULAI LANGSUNG DARI\\\",\\n\\n      \\\"reason\\\": \\\"alasan memberikan jumlah EXP\\\"\\n\\n    }\\n\\n  }\\n\\n}\"}] }] }";

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

    switch (JSON.parse(decoded_text)) {
      case (#err(e)) {
        Debug.print("Parse error: " # debug_show (e));
        "Error Generating Data";
      };
      case (#ok(data)) {
        switch (JSON.get(data, "candidates[0].content.parts[0].text")) {
          case (null) {
            Debug.print("Field tidak ditemukan");
            "Error Generating Data";
          };
          case (?jsonString) {
            switch (jsonString) {
              case (#String(jsonText)) {
                switch (JSON.parse(jsonText)) {
                  case (#err(e)) {
                    Debug.print("Parse error: " # debug_show (e));
                    "Error Generating Data";
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
                "Error Generating Data";
              };
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
