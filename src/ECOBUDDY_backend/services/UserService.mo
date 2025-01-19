import Text "mo:base/Text";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

import Types "../types/Types";

module {
    public func createUser(
        users: Types.Users,
        userId: Principal,
        walletAddress: Text
    ): Result.Result<Types.User, Text> {
        // CEK USER PRINCIPAL
        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed");
        };

        // CEK USER WALLET ADDRES
        if (Text.size(walletAddress) == 0) {
            return #err("Wallet address cannot be empty");
        };

        // CHECK USER ALLREADY EXIST
        switch (users.get(userId)) {
            case (?userExist) {
                // RETURN IF EXIST
                return #ok(userExist);
            };
            case null {
                // CREATE NEW IF NO
                let newUser: Types.User = {
                    id = userId;
                    username = "User";
                    level = 1;
                    walletAddres = walletAddress;
                };

                users.put(userId, newUser);
                return #ok(newUser);
            };
        };
    };

    public func updateUser (
        users: Types.Users,
        userId: Principal,
        username : Text
    ) : Result.Result<Types.User, Text> {
        // CEK USER PRINCIPAL
        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed");
        };

        switch(users.get(userId)){
            // USER VALID
            case (?userExist){
                
                let updatedUser : Types.User = {
                    id = userExist.id;
                    username = username;
                    level = userExist.level;
                    walletAddres = userExist.walletAddres;
                };
                users.put(userId, updatedUser);
                #ok(updatedUser)
            };
            case null {
                return #err("User not found")
            };
        };
    };

};
