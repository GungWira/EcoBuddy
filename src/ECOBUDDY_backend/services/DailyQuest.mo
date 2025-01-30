import Types "../types/Types";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
module{
    public func checkDailyQuest(userId : Principal, dailyQuests : Types.DailyQuests, date : Text) : Result.Result<Types.DailyQuest, Text>{
        
        // Cek apakah data pengguna ada
        let currentDQ = dailyQuests.get(userId);
        switch(currentDQ) {
            case (?isCurrentDQ) {
                if (isCurrentDQ.date == date) {
                // Jika tanggal sama, return progres saat ini
                return #ok isCurrentDQ;
                } else {
                // Jika tanggal berbeda, buat daily quest baru
                let newData = { 
                    date = date;
                    login = false;
                    chatCount = 0;
                    quizCount = 0;
                };
                dailyQuests.put(userId, newData);
                return #ok newData;
                };
            };
            case null {
                // Jika belum ada data, buat daily quest baru
                let newData = { 
                    date = date;
                    login = false;
                    chatCount = 0;
                    quizCount = 0;
                };
                dailyQuests.put(userId, newData);
                return #ok newData;
            };
        };
    };
    public func addChatCount (userId : Principal, dailyQuests : Types.DailyQuests) : async Result.Result<Types.DailyQuest, Text>{
        if(Principal.isAnonymous(userId)){
            return #err("Anonymous principals are not allowed");
        };

        switch (dailyQuests.get(userId)){
            case (?dailyQuestExist){
                let newData = { 
                    date = dailyQuestExist.date;
                    login = dailyQuestExist.login;
                    chatCount = dailyQuestExist.chatCount + 1;
                    quizCount = dailyQuestExist.quizCount;
                };
                dailyQuests.put(userId, newData);
                return #ok newData;
            };
            case null {
                return #err "Error Adding Data";
            }
        }
    };
};