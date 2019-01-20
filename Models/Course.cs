
using System.Collections.Generic;
using Newtonsoft.Json;

[JsonObject("course")]
public class Course
{
    [JsonProperty("id")]
    public string Id;

    [JsonProperty("title")]
    public string Title;

    [JsonProperty("path")]
    public string Path;

    [JsonProperty("lessons")]
    public IEnumerable<Lesson> Lessons;
}
