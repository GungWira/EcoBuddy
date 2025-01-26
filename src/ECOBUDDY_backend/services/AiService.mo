import IC "ic:aaaaa-aa";
import Cycles "mo:base/ExperimentalCycles";
import Text "mo:base/Text";
import JSON "mo:json";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Int "mo:base/Int";

import GlobalConstants "../constants/GlobalConstants";
import Types "../types/Types";


module {
    public func httpReq(input : Text, passAnswer : Text) : async Result.Result<Types.ResponseAI, Text> {
        let url = "https://"# GlobalConstants.HOST # GlobalConstants.PATH # GlobalConstants.API_KEY; //HTTP that accepts IPV6
        let idempotency_key : Text = generateUUID();

        let request_headers = [
            { name = "User-Agent"; value = "POST_USER_COMMAND" },
            { name = "Content-Type"; value = "application/json" },
            { name = "Idempotency-Key"; value = idempotency_key },
        ];

        let request_body_json : Text = "{ \"contents\": [ { \"parts\": [ { \"text\": \"Berikut adalah sebuah pesan dalam percakapan antara pengguna dan AI yang membahas topik lingkungan, khususnya pengelolaan sampah maupun kesehatan lingkungan. Fokus percakapan adalah pada prompt berikut: "# input #"\\n\\n User juga sebelumnya mendapatkan jawaban ini dari anda : "# passAnswer #"\\n\\n Anda bernama EcoBot, seorang personal asisten yang akan membantu user menjadi lebih baik dari segi pehamana lingkungan dan menuju dunia lebih bersih. Tugas Anda adalah memberikan evaluasi atau jawaban terhadap prompt tersebut dan memberikan respons dalam format JSON string yang valid, tanpa karakter tambahan seperti ```json atau ```. yang telah ditentukan. Pastikan untuk menyertakan:\\n\\n 1. Jika input tidak relevan dengan topik lingkungan atau isu sampah plastik (contoh: sapaan sederhana seperti \\\"halo\\\", \\\"apa kabar\\\", atau \\\"selamat pagi\\\"), berikan respons singkat berikut:\\n { \\\"response\\\": { \\\"solution\\\": \\\"Jawaban singkat juga kepada pengguna, dan silahkan tambahkan hooks atau umpan balik ke pengguna berupa pertanyaan singkat saja, misal jika user hanya menyapa maka silahkan sapa balik dan tanyakan seperti ingin berbuat baik tentnag lingkungan apa sekarang, dan sejenisnya anda bisa lakukan improvisasi disini\\\", \\\"expAmmount\\\": { \\\"point\\\": 0 } } }\\n\\n 2. Jika input relevan, jawab pertanyaan pengguna dengan singkat saja, pastikan gunakan bahasa yang ramah dan tidak terlalu baku, seperti anda berbicara dengan anak-anak, selalu ingat memberi umpan balik di akhir jawaban. Anda bisa menyertakan solusi atau ide praktis yang dapat diterapkan oleh pengguna terkait pertanyaan tersebut, seperti:\\n - Menjelaskan konteks atau latar belakang terkait isu sampah plastik.\\n - Memberikan metode yang dapat diterapkan dengan langkah-langkah rinci.\\n - Mengintegrasikan pendekatan kreatif, tradisional, dan berbasis kolaborasi komunitas jika memungkinkan.\\n - Menjelaskan dampak positif dari solusi, baik untuk individu maupun lingkungan.\\n - Membahas hasil jangka pendek dan panjang dari penerapan solusi.\\n - Mengulas realisme solusi, termasuk potensi tantangan dan cara mengatasinya.\\n - Menyertakan tips, alat, atau referensi tambahan yang relevan.\\n\\n Penilaian dampak positif terhadap lingkungan: Spekulasi tentang dampak implementasi solusi terhadap pengurangan sampah plastik, edukasi masyarakat, atau keterlibatan komunitas lokal.\\n Tinjau potensi pengurangan sampah plastik, inspirasi bagi orang lain, dan mendorong perubahan perilaku masyarakat.\\n\\n Penilaian realisme: Tinjau apakah solusi tersebut realistis untuk diterapkan oleh pengguna rata-rata dengan sumber daya terbatas. Pertimbangkan kesulitan teknis, biaya, waktu, dan keahlian yang dibutuhkan.\\n\\n Penilaian menariknya pertanyaan: Nilai potensi pertanyaan ini untuk memotivasi diskusi atau inovasi lebih lanjut terkait pengelolaan sampah plastik.\\n\\n Penambahan 'experience points' (EXP): Evaluasi dan berikan jumlah EXP kepada pengguna berdasarkan kriteria berikut:\\n - 25 EXP: Pertanyaan sangat spesifik, relevan, proaktif, dan kreatif.\\n - 15 EXP: Pertanyaan cukup spesifik dan relevan, namun kurang proaktif atau kreatif.\\n - 5 EXP: Pertanyaan umum tentang lingkungan.\\n - 0 EXP: Pertanyaan tidak relevan atau tidak memberikan kontribusi pada diskusi.\\n\\n Berikut adalah format respons dalam JSON STRING yang harus digunakan (jangan menambahkan informasi di luar format ini):\\n\\n { \\\"response\\\": { \\\"solution\\\": \\\"Jawaban komprehensif yang mencakup semua aspek yang diminta.\\\", \\\"expAmmount\\\": { \\\"point\\\": \\\"jumlah total EXP berdasarkan evaluasi di atas (0, 5, 15, 25).\\\" } } }\\n\\n Jika anda ingin memberikan highlight pada satu judul atau apapun itu, jangan gunakan tanda seperti ** atau sejenisnya, \" } ] } ] }";

        let request_body = Text.encodeUtf8(request_body_json);

        let http_request : IC.http_request_args = {
            url = url;
            max_response_bytes = null;
            headers = request_headers;
            body = ?request_body;
            method = #post;
            transform = null
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
                #err "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
            };
            case (#ok(data)){
                // Debug.print(debug_show(data));
                switch(JSON.get(data, "candidates[0].content.parts[0].text")){
                case (null){
                    Debug.print("Field tidak ditemukan");
                    #err "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
                };
                case (?jsonString){
                    switch(jsonString){
                    case(#String(jsonText)){
                        switch (JSON.parse(jsonText)){
                        case(#err(e)){
                            Debug.print("Parse error: " # debug_show(e));
                            #err "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
                        };
                        case(#ok(parsedJson)){
                            let solution = switch(JSON.get(parsedJson, "response.solution")){
                            case (null) { "Solution not found" };
                            case (?value) { 
                                switch (value) {
                                case (#String(s)) { s };  // Convert JSON string to Text
                                case _ { "Invalid Solution format" };  // In case it's not a string
                                }
                            };
                            };
                            // passAnswer := solution;
                            let exp : Int = switch (JSON.get(parsedJson, "response.expAmmount.point")) {
                            case (null) { 0 };  
                            case (?value) {
                                switch (value) {
                                case (#Number(#Int(i))) { i };  
                                case _ { 0 };  
                                }
                            };
                            };

                            // Debug.print("Solution: " # solution);
                            // Debug.print(debug_show(exp));
                            // totalExp := totalExp + Int.abs(exp);
                            let response : Types.ResponseAI = {
                                solution = solution;
                                exp = Int.abs(exp);
                            };
                            #ok response;
                        };
                        };
                    };
                    case _{
                        Debug.print("'c' is not a string");
                        #err "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
                    }
                    };
                };
                };
            };
        };
    };


    public func generateUUID() : Text {
        "UUID-123456789";
    };
};