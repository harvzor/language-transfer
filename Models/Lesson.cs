using Newtonsoft.Json;

[JsonObject("lesson")]
public class Lesson
{
    [JsonProperty("lessonId")]
    public int LessonId;

    [JsonProperty("courseName")]
    public string CourseName;

    [JsonProperty("title")]
    public string Title;

    [JsonProperty("fileName")]
    public string FileName;

    [JsonProperty("fileSize")]
    public long FileSize;
}
