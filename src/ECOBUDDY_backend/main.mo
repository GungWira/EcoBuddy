import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

actor EcoBuddy {
  type userName = Text;
  private var userName = HashMap.HashMap<Principal, userName>(
    10,                  // Ukuran awal hash map
    Principal.equal,     // Fungsi pembanding Principal
    Principal.hash       // Fungsi hash untuk Principal
  );

  // Fungsi untuk mendapatkan username berdasarkan Principal pengguna
  public shared (msg) func getUsername() : async ?Text {
    let caller = msg.caller; // Principal dari pengguna yang memanggil
    return userName.get(caller); // Ambil username berdasarkan Principal
  };

  // Fungsi untuk menyimpan atau memperbarui username
  public shared (msg) func setUsername(newUsername: Text) : async () {
    let caller = msg.caller; // Principal dari pengguna yang memanggil
    userName.put(caller, newUsername); // Simpan atau perbarui username
  };
};
