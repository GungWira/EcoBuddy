import Types "../types/Types";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

module{    
    public func getDailyQuizs(userId : Principal, date : Text, dailyQuizs : Types.DailyQuizs, id1 : Text, id2 : Text, id3 : Text) : async Result.Result<Types.DailyQuiz, Text>{

        let currentDQ = dailyQuizs.get(userId);
        switch(currentDQ) {
            case (?isCurrentDQ) {
                if (isCurrentDQ.date == date) {
                // Jika tanggal sama, return quiz saat ini
                return #ok isCurrentDQ;
                } else {
                // Jika tanggal berbeda, buat daily quest baru
                let newData = { 
                    date = date ;
                    quizNum1 = id1;
                    quizNum2 = id2;
                    quizNum3 = id3;
                    statQuizNum1 = false;
                    statQuizNum2 = false;
                    statQuizNum3 = false;
                };
                dailyQuizs.put(userId, newData);
                return #ok newData;
                };
            };
            case null {
                // Jika belum ada data, buat daily quest baru
                let newData = { 
                    date = date ;
                    quizNum1 = id1;
                    quizNum2 = id2;
                    quizNum3 = id3;
                    statQuizNum1 = false;
                    statQuizNum2 = false;
                    statQuizNum3 = false;
                };
                dailyQuizs.put(userId, newData);
                return #ok newData;
            };
        };
    };

    public func submitDailyQuiz(userId : Principal, id : Text, dailyQuizs : Types.DailyQuizs) : async Result.Result<Types.DailyQuiz, Text>{
         let currentDQ = dailyQuizs.get(userId);
         switch(currentDQ){
            case(?isCurrentDQ){
                if(isCurrentDQ.quizNum1 == id){
                    let newData = { 
                        date = isCurrentDQ.date;
                        quizNum1 = isCurrentDQ.quizNum1;
                        quizNum2 = isCurrentDQ.quizNum2;
                        quizNum3 = isCurrentDQ.quizNum3;
                        statQuizNum1 = true;
                        statQuizNum2 = isCurrentDQ.statQuizNum2;
                        statQuizNum3 = isCurrentDQ.statQuizNum3;
                    };
                    dailyQuizs.put(userId, newData);
                    return #ok newData;
                }else if(isCurrentDQ.quizNum2 == id){
                    let newData = { 
                        date = isCurrentDQ.date;
                        quizNum1 = isCurrentDQ.quizNum1;
                        quizNum2 = isCurrentDQ.quizNum2;
                        quizNum3 = isCurrentDQ.quizNum3;
                        statQuizNum1 = isCurrentDQ.statQuizNum1;
                        statQuizNum2 = true;
                        statQuizNum3 = isCurrentDQ.statQuizNum3;
                    };
                    dailyQuizs.put(userId, newData);
                    return #ok newData;
                }else{
                    let newData = { 
                        date = isCurrentDQ.date;
                        quizNum1 = isCurrentDQ.quizNum1;
                        quizNum2 = isCurrentDQ.quizNum2;
                        quizNum3 = isCurrentDQ.quizNum3;
                        statQuizNum1 = isCurrentDQ.statQuizNum1;
                        statQuizNum2 = isCurrentDQ.statQuizNum2;
                        statQuizNum3 = true;
                    };
                    dailyQuizs.put(userId, newData);
                    return #ok newData;
                }
            };
            case(null){
                #err"Error Updating Data";
            }
         };
    };
};