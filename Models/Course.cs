
using System.Collections.Generic;
using Newtonsoft.Json;

namespace language_transfer
{
    [JsonObject("course")]
    public class Course
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("lessons")]
        public List<Lesson> Lessons { get; set; }
    }
}
