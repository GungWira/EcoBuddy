import Cycles "mo:base/ExperimentalCycles";
import Text "mo:base/Text";
import IC "ic:aaaaa-aa";

module{
    public func getNews() : async Text {
        let host : Text = "jakpost.vercel.app";
        let url = "https://" # host # "/api/category/culture/environment/page/1";

        let request_headers = [
            { name = "User-Agent"; value = "News" },
        ];

        let http_request : IC.http_request_args = {
        url = url;
        max_response_bytes = null; 
        headers = request_headers;
        body = null; 
        method = #get;
        transform = null
        };

        Cycles.add<system>(230_949_972_000);

        let http_response : IC.http_request_result = await IC.http_request(http_request);

        let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
        case (null) { "No value returned" };
        case (?y) { y };
        };

        decoded_text;
    }
}