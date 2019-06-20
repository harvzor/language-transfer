using System.Collections.Generic;
using Newtonsoft.Json;

namespace language_transfer
{
    [JsonObject("data")]
    public class Data
    {
        [JsonProperty("courses")]
        public IEnumerable<Course> Courses { get; set; }
    }
}
