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
    public func askBot(input : Text, passAnswer : Text) : async Result.Result<Types.ResponseAI, Text> {
        let idempotency_key : Text = generateUUID();
        // GEMINI
        let url = "https://"# GlobalConstants.HOST # GlobalConstants.PATH # GlobalConstants.API_KEY; 

        let request_headers = [
            { name = "User-Agent"; value = "POST_USER_COMMAND" },
            { name = "Content-Type"; value = "application/json" },
            { name = "Idempotency-Key"; value = idempotency_key },
        ]; 
        
        let request_body_json : Text = "{ \"contents\": [ { \"parts\": [ { \"text\": \"Berikut adalah sebuah pesan dalam percakapan antara pengguna dan AI yang membahas topik lingkungan, khususnya pengelolaan sampah maupun kesehatan lingkungan. Fokus percakapan adalah pada prompt berikut: "# input #"\\n\\n User juga sebelumnya mendapatkan jawaban ini dari anda : "# passAnswer #"\\n\\n Anda bernama EcoBot, seorang personal asisten yang akan membantu user menjadi lebih baik dari segi pehamana lingkungan dan menuju dunia lebih bersih. Tugas Anda adalah memberikan evaluasi atau jawaban terhadap prompt tersebut dan memberikan respons dalam format JSON string yang valid, tanpa karakter tambahan seperti ```json atau ```. yang telah ditentukan. Pastikan untuk menyertakan:\\n\\n 1. Jika input tidak relevan dengan topik lingkungan atau isu sampah plastik (contoh: sapaan sederhana seperti \\\"halo\\\", \\\"apa kabar\\\", atau \\\"selamat pagi\\\"), berikan respons singkat berikut:\\n { \\\"response\\\": { \\\"solution\\\": \\\"Jawaban singkat juga kepada pengguna, dan silahkan tambahkan hooks atau umpan balik ke pengguna berupa pertanyaan singkat saja, misal jika user hanya menyapa maka silahkan sapa balik dan tanyakan seperti ingin berbuat baik tentnag lingkungan apa sekarang, dan sejenisnya anda bisa lakukan improvisasi disini\\\", \\\"expAmmount\\\": { \\\"point\\\": 0 } } }\\n\\n 2. Jika input relevan, jawab pertanyaan pengguna dengan singkat saja, pastikan gunakan bahasa yang ramah dan tidak terlalu baku, seperti anda berbicara dengan anak-anak, selalu ingat memberi umpan balik di akhir jawaban. Anda bisa menyertakan solusi atau ide praktis yang dapat diterapkan oleh pengguna terkait pertanyaan tersebut, seperti:\\n - Menjelaskan konteks atau latar belakang terkait isu sampah plastik.\\n - Memberikan metode yang dapat diterapkan dengan langkah-langkah rinci.\\n - Mengintegrasikan pendekatan kreatif, tradisional, dan berbasis kolaborasi komunitas jika memungkinkan.\\n - Menjelaskan dampak positif dari solusi, baik untuk individu maupun lingkungan.\\n - Membahas hasil jangka pendek dan panjang dari penerapan solusi.\\n - Mengulas realisme solusi, termasuk potensi tantangan dan cara mengatasinya.\\n - Menyertakan tips, alat, atau referensi tambahan yang relevan.\\n\\n Penilaian dampak positif terhadap lingkungan: Spekulasi tentang dampak implementasi solusi terhadap pengurangan sampah plastik, edukasi masyarakat, atau keterlibatan komunitas lokal.\\n Tinjau potensi pengurangan sampah plastik, inspirasi bagi orang lain, dan mendorong perubahan perilaku masyarakat.\\n\\n Penilaian realisme: Tinjau apakah solusi tersebut realistis untuk diterapkan oleh pengguna rata-rata dengan sumber daya terbatas. Pertimbangkan kesulitan teknis, biaya, waktu, dan keahlian yang dibutuhkan.\\n\\n Penilaian menariknya pertanyaan: Nilai potensi pertanyaan ini untuk memotivasi diskusi atau inovasi lebih lanjut terkait pengelolaan sampah plastik.\\n\\n Penambahan 'experience points' (EXP): Evaluasi dan berikan jumlah EXP kepada pengguna berdasarkan kriteria berikut:\\n - 50 EXP: Pertanyaan sangat spesifik, relevan, proaktif, dan kreatif.\\n - 25 EXP: Pertanyaan cukup spesifik dan relevan, namun kurang proaktif atau kreatif.\\n - 15 EXP: Pertanyaan umum tentang lingkungan.\\n - 0 EXP: Pertanyaan tidak relevan atau tidak memberikan kontribusi pada diskusi.\\n\\n Berikut adalah format respons dalam JSON STRING yang harus digunakan (jangan menambahkan informasi di luar format ini):\\n\\n { \\\"response\\\": { \\\"solution\\\": \\\"Jawaban komprehensif yang mencakup semua aspek yang diminta.\\\", \\\"expAmmount\\\": { \\\"point\\\": \\\"jumlah total EXP berdasarkan evaluasi di atas (0, 5, 15, 25).\\\" } } }\\n\\n Jika anda ingin memberikan highlight pada satu judul atau apapun itu, jangan gunakan tanda seperti ** atau sejenisnya, \" } ] } ] }";

        // GPT
        // let url = "https://"# GlobalConstants.HOST_GPT # GlobalConstants.PATH_GPT;

        // let request_headers = [
        //     { name = "User-Agent"; value = "POST_USER_COMMAND" },
        //     { name = "Content-Type"; value = "application/json" },
        //     { name = "Idempotency-Key"; value = idempotency_key },
        //     { name = "Authorization"; value = "Bearer "#GlobalConstants.API_KEY_GPT },
        // ];

        // let request_body_json : Text = "{ \"model\": \"gpt-4o-mini\", \"store\": true, \"messages\": [ { \"role\": \"system\", \"content\": \"Anda bernama EcoBot, seorang personal asisten yang akan membantu user menjadi lebih baik dalam memahami lingkungan dan menuju dunia lebih bersih. Anda harus memberikan evaluasi atau jawaban terhadap prompt yang diberikan dan memberikan respons dalam format JSON string yang valid.\\n\\n Jika input tidak relevan dengan topik lingkungan atau isu sampah plastik (contoh: sapaan sederhana seperti \\\"halo\\\", \\\"apa kabar\\\", atau \\\"selamat pagi\\\"), berikan respons singkat berikut:\\n { \\\"response\\\": { \\\"solution\\\": \\\"Jawaban singkat dan berikan umpan balik berupa pertanyaan singkat untuk mendorong diskusi tentang lingkungan.\\\", \\\"expAmmount\\\": { \\\"point\\\": 0 } } }\\n\\n Jika input relevan, jawab pertanyaan pengguna dengan singkat dan ramah, seperti berbicara dengan anak-anak. Selalu beri umpan balik di akhir jawaban. Anda bisa menyertakan solusi atau ide praktis yang dapat diterapkan oleh pengguna terkait pertanyaan tersebut.\\n\\n Penilaian dampak positif terhadap lingkungan, realisme solusi, dan potensi diskusi harus dipertimbangkan dalam jawaban Anda.\\n\\n Evaluasi pengalaman pengguna berdasarkan kategori berikut:\\n - 25 EXP: Pertanyaan sangat spesifik, relevan, proaktif, dan kreatif.\\n - 15 EXP: Pertanyaan cukup spesifik dan relevan, namun kurang proaktif atau kreatif.\\n - 5 EXP: Pertanyaan umum tentang lingkungan.\\n - 0 EXP: Pertanyaan tidak relevan atau tidak berkontribusi pada diskusi.\\n\\n Jawaban harus dalam format berikut:\\n { \\\"response\\\": { \\\"solution\\\": \\\"Jawaban komprehensif yang mencakup semua aspek yang diminta.\\\", \\\"expAmmount\\\": { \\\"point\\\": \\\"jumlah total EXP berdasarkan evaluasi di atas (0, 5, 15, 25).\\\" } } }\" }, { \"role\": \"user\", \"content\": \"Berikut adalah sebuah pesan dalam percakapan antara pengguna dan AI yang membahas topik lingkungan, khususnya pengelolaan sampah maupun kesehatan lingkungan. Fokus percakapan adalah pada prompt berikut: " # input # "\\n\\n User juga sebelumnya mendapatkan jawaban ini dari anda : " # passAnswer # "\\n\\n Berikan evaluasi dan respons terhadap prompt ini.\" } ] }";



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

        Debug.print("DECODED-TEXT : "#debug_show(decoded_text));
        Debug.print("Checking for 'null': " # debug_show(Text.contains(decoded_text, #text "null")));
        // let sanitized_text = Text.replace(decoded_text, #text "null", "\"\""); //GPT

        switch(JSON.parse(decoded_text)){ // GEMINI
        // switch(JSON.parse(sanitized_text)){ // GPT
            case(#err(e)){
                Debug.print("Parse Text Error: " # debug_show(e));
                #err "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
            };
            case (#ok(data)){
                Debug.print("PARSED-JSON : "#debug_show(data));

                switch(JSON.get(data, "candidates[0].content.parts[0].text")){ // GEMINI
                // switch(JSON.get(data, "choices[0].message.content")){ // GPT
                case (null){
                    Debug.print("Field tidak ditemukan");
                    Debug.print(debug_show(data));
                    #err "Yah EcoBot gapaham maksud kamu! Jangan sedih, coba ketik ulang yuk yang kamu mau!";
                };
                case (?jsonString){
                    switch(jsonString){
                    case(#String(jsonText)){
                        let validJsonText = switch(Text.startsWith(jsonText, #char '`')){
                            
                            case(true) {
                                let withoutStart = Text.replace(jsonText, #text "```", "");
                                let result = Text.replace(withoutStart, #text "json", "");
                                result;
                            };
                            case (false){
                                jsonText;
                            };
                        };
                        switch (JSON.parse(validJsonText)){
                        case(#err(e)){
                            Debug.print("Parse error: " # debug_show(e));
                            let withoutStart = Text.trimStart(jsonText, #char '`');
                            let withoutEnd = Text.trimEnd(withoutStart, #char '`');
                            let result = Text.replace(withoutEnd, #text "JSON", ""); 
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
                            let exp : Int = switch (JSON.get(parsedJson, "response.expAmmount.point")) {
                            case (null) { 0 };  
                            case (?value) {
                                switch (value) {
                                case (#Number(#Int(i))) { i };  
                                case _ { 0 };  
                                }
                            };
                            };

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

    public func askQuiz(theme : Text) : async Result.Result<Text, Text> {
        let url = "https://"# GlobalConstants.HOST # GlobalConstants.PATH # GlobalConstants.API_KEY; //HTTP that accepts IPV6
        let idempotency_key : Text = generateUUID();

        let request_headers = [
            { name = "User-Agent"; value = "POST_USER_COMMAND" },
            { name = "Content-Type"; value = "application/json" },
            { name = "Idempotency-Key"; value = idempotency_key },
        ];

        let request_body_json : Text = "{ \"contents\": [ { \"parts\": [ { \"text\": \"Buatkan 10 soal tentang lingkungan dalam format kuis singkat dengan tema: "# theme #". Setiap soal memiliki 3 pilihan jawaban dan 1 jawaban benar. Tema soal adalah seputar lingkungan, dirancang untuk siswa SD-SMA, dan dibuat dari tingkat termudah hingga yang lebih sulit. Soalnya harus fun dan menambah wawasan. Format output dalam JSON seperti ini: { \\\"questions\\\": [ { \\\"question\\\": \\\"Apa nama tempat tinggal alami hewan?\\\", \\\"options\\\": [\\\"Kandang\\\", \\\"Habitat\\\", \\\"Sangkar\\\"], \\\"answer\\\": \\\"Habitat\\\", \\\"reason\\\": \\\"Habitat adalah lingkungan alami tempat hewan hidup.\\\" }, { \\\"question\\\": \\\"Pohon apa yang dikenal sebagai paru-paru dunia?\\\", \\\"options\\\": [\\\"Mangga\\\", \\\"Hutan Tropis\\\", \\\"Kelapa\\\"], \\\"answer\\\": \\\"Hutan Tropis\\\", \\\"reason\\\": \\\"Hutan tropis menghasilkan oksigen dalam jumlah besar untuk dunia.\\\" }, { \\\"question\\\": \\\"Apa yang sering digunakan untuk membuat kompos di rumah?\\\", \\\"options\\\": [\\\"Daun kering\\\", \\\"Plastik\\\", \\\"Kaca\\\"], \\\"answer\\\": \\\"Daun kering\\\", \\\"reason\\\": \\\"Daun kering dapat terurai secara alami dan membantu proses pembuatan kompos.\\\" }, { \\\"question\\\": \\\"Hewan apa yang dikenal sebagai indikator kebersihan lingkungan?\\\", \\\"options\\\": [\\\"Katak\\\", \\\"Burung\\\", \\\"Anjing\\\"], \\\"answer\\\": \\\"Katak\\\", \\\"reason\\\": \\\"Katak hanya hidup di lingkungan yang bersih dan bebas polusi.\\\" }, { \\\"question\\\": \\\"Apa yang bisa kita lakukan untuk mengurangi sampah plastik?\\\", \\\"options\\\": [\\\"Menggunakan tas kain\\\", \\\"Membuang di sungai\\\", \\\"Membakar plastik\\\"], \\\"answer\\\": \\\"Menggunakan tas kain\\\", \\\"reason\\\": \\\"Tas kain dapat digunakan berulang kali dan mengurangi penggunaan plastik sekali pakai.\\\" } ] } ingat, buat 10 soal saja dengan format seperti itu.\" } ] } ] }";

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
                #err"Error Generating Data";
            };
            case (#ok(data)){
                switch(JSON.get(data, "candidates[0].content.parts[0].text")){
                case (null){
                    Debug.print(debug_show(data));
                    Debug.print("Field tidak ditemukan");
                    #err"Error Generating Data";
                };
                case (?jsonString){
                    switch(jsonString){
                    case(#String(jsonText)){
                        let validJsonText = switch(Text.startsWith(jsonText, #char '`')){
                            
                            case(true) {
                                let withoutStart = Text.replace(jsonText, #text "```", "");
                                let result = Text.replace(withoutStart, #text "json", "");
                                result;
                            };
                            case (false){
                                jsonText;
                            };
                        };
                        #ok validJsonText;
                    };
                    case _{
                        Debug.print("'c' is not a string");
                        #err"Error Generating Data";
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