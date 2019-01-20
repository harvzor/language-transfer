using Newtonsoft.Json;

[JsonObject("lesson")]
public class Lesson
{
    [JsonProperty("id")]
    public string Id;

    [JsonProperty("title")]
    public string Title;

    [JsonProperty("fileName")]
    public string FileName;
}
