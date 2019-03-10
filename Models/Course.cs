
using System.Collections.Generic;
using Newtonsoft.Json;

[JsonObject("course")]
public class Course
{
    [JsonProperty("name")]
    public string Name;

    [JsonProperty("title")]
    public string Title;

    [JsonProperty("path")]
    public string Path;

    [JsonProperty("lessons")]
    public IEnumerable<Lesson> Lessons;
}
