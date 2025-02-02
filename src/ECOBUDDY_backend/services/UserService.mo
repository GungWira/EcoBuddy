import Text "mo:base/Text";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
// import Random "mo:base/Random";

import Types "../types/Types";
import GlobalConstants "../constants/GlobalConstants";

module {
    public func createUser(
        users : Types.Users,
        userId : Principal,
        walletAddress : Text,
    ) : async Result.Result<Types.User, Text> {
        // CEK USER PRINCIPAL
        if (Principal.isAnonymous(userId)) {
            return #err "Anonymous principals are not allowed";
        };

        // CEK USER WALLET ADDRES
        if (Text.size(walletAddress) == 0) {
            return #err "Wallet address cannot be empty";
        };

        // CHECK USER ALLREADY EXIST
        switch (users.get(userId)) {
            case (?userExist) {
                // RETURN IF EXIST
                return #ok(userExist);
            };
            case null {
                // CREATE NEW IF NO
                let newUser : Types.User = {
                    id = userId;
                    username = "User";
                    level = 1;
                    walletAddress = walletAddress;
                    expPoints = 20; // START 20 EXP, AUTO LOGIN USER
                    achievements = [];
                    avatar = GlobalConstants.AVATAR_BASIC;
                    profile = GlobalConstants.PROFILE_DEFAULT;
                };

                users.put(userId, newUser);
                return #ok(newUser);
            };
        };
    };

    public func updateUser(users : Types.Users, userId : Principal, data : Types.UserUpdateProfile) : async Result.Result<Types.User, Text> {
        // auth
        if (Principal.isAnonymous(userId)) {
            return #err "Anonymous principals are not allowed";
        };

        // query data
        let userData = users.get(userId);

        // validate if exists
        switch (userData) {
            case (null) {
                return #err "User not found";
            };
            case (?currentUser) {
                let updatedUser : Types.User = {
                    id = currentUser.id;
                    username = switch (data.username) {
                        case ("") { currentUser.username };
                        case (_) { data.username };
                    };
                    level = currentUser.level;
                    walletAddress = currentUser.walletAddress;
                    expPoints = currentUser.expPoints;
                    achievements = currentUser.achievements;
                    avatar = currentUser.avatar;
                    profile = switch (data.profile) {
                        case ("") { currentUser.profile };
                        case (_) { data.profile };
                    };
                };
                users.put(userId, updatedUser);
                
                return #ok updatedUser;
            };
        };
    };
};
