using System.Collections.Generic;
using Newtonsoft.Json;

[JsonObject("data")]
public class Data
{
    [JsonProperty("courses")]
    public IEnumerable<Course> Courses;
}
