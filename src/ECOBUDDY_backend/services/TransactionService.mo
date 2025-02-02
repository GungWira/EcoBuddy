import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";
import IcpLedger "canister:icp_ledger_canister";
import Types "../types/Types";

module {
  private func manageUserBalance(
    userBalances : Types.UserBalances,
    userId : Principal,
    amount : Nat,
    operation : { #increment; #decrement },
  ) : Result.Result<(), Text> {
    // function to create new balance record
    func createNewBalance(amt : Nat) : Types.UserBalance {
      {
        id = userId;
        balance = amt;
        total_transaction = 0;
      };
    };

    // function to update existing balance
    func updateBalance(current : Types.UserBalance, amt : Nat, isDecrease : Bool) : Types.UserBalance {
      {
        id = current.id;
        balance = if (isDecrease) Nat.sub(current.balance, amt) else current.balance + amt;
        total_transaction = if (isDecrease) current.total_transaction + amt else current.total_transaction;
      };
    };

    let currentBalance = userBalances.get(userId);

    switch (currentBalance, operation) {
      case (null, #decrement) #err("No balance found for user");
      case (?balance, #decrement) {
        if (balance.balance < amount) {
          #err("Balance insufficient for transaction");
        } else {
          userBalances.put(userId, updateBalance(balance, amount, true));
          #ok();
        };
      };
      case (null, #increment) {
        userBalances.put(userId, createNewBalance(amount));
        #ok();
      };
      case (?balance, #increment) {
        userBalances.put(userId, updateBalance(balance, amount, false));
        #ok();
      };
    };
  };

  public func handleGetAccountBalance(userId : Principal, userBalances : Types.UserBalances) : async Types.UserBalance {
    let balance = userBalances.get(userId);
    let ledgerBalance = await IcpLedger.icrc1_balance_of({
      owner = userId;
      subaccount = null;
    });

    switch (balance) {
      case (null) {
        userBalances.put(
          userId,
          {
            id = userId;
            balance = ledgerBalance;
            total_transaction = 0;
          },
        );

        return {
          id = userId;
          balance = ledgerBalance;
          total_transaction = 0;
        };

      };
      case (?value) {
        return value;
      };
    };
  };

  public func handleTransferICP(
    from : Principal,
    to : Principal,
    amount : Nat64,
    userBalances : Types.UserBalances,
  ) : async Result.Result<IcpLedger.BlockIndex, Text> {

    // Get account balances
    let fromBalance = await handleGetAccountBalance(from, userBalances);
    Debug.print("From account balance: " # debug_show (fromBalance));

    let totalAmountNeeded = Nat64.toNat(amount) + 10_000; // Including the fee
    if (fromBalance.balance < totalAmountNeeded) {
      return #err("Insufficient balance to cover the transfer and the fee");
    };

    // Update internal balances
    let fromBalanceResult = manageUserBalance(userBalances, from, Nat64.toNat(amount), #decrement);
    let toBalanceResult = manageUserBalance(userBalances, to, Nat64.toNat(amount), #increment);

    switch (fromBalanceResult, toBalanceResult) {
      case (#err(e), _) { return #err(e) };
      case (_, #err(e)) { return #err(e) };
      case (#ok(_), #ok(_)) {
        let accountIdentifier = await IcpLedger.account_identifier({
          owner = to;
          subaccount = null;
        });

        Debug.print("Account identifier: " # debug_show (accountIdentifier));

        let transferArgs : IcpLedger.TransferArgs = {
          to = accountIdentifier;
          memo = 0;
          amount = { e8s = amount };
          fee = { e8s = 10_000 }; // Fee in e8s
          from_subaccount = null;
          created_at_time = null;
        };

        Debug.print("Initiating transfer to: " # debug_show (to));
        Debug.print("Amount: " # debug_show (amount));
        Debug.print("Fee: " # debug_show (10_000));

        let transferResult = await IcpLedger.transfer(transferArgs);
        switch (transferResult) {
          case (#Ok(blockIndex)) {
            Debug.print("Transfer successful. Block index: " # debug_show (blockIndex));
            return #ok(blockIndex);
          };
          case (#Err(transferError)) {
            Debug.print("Transfer failed: " # debug_show (transferError));
            return #err("Transfer failed: " # debug_show (transferError));
          };
        };
      };
    };
  };
}