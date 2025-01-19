import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module{
    public type Users = HashMap.HashMap<Principal, User>;

    // USER TYPE
    public type User = {
        id : Principal;
        username : Text;
        level : Nat;
        walletAddres : Text;
    }
}