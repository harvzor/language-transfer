using language_transfer.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace language_transfer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioController : ControllerBase
    {
        private readonly IAudioService AudioService;
        private readonly IMemoryCache MemoryCache;
        private const string CacheKey = "AudioController";

        public AudioController(IMemoryCache memoryCache, IAudioService audioService)
        {
            this.AudioService = audioService ?? throw new ArgumentNullException(nameof(audioService));
            this.MemoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
        }

        [HttpGet("Courses")]
        [ResponseCache(Duration = 300)]
        public ActionResult<IEnumerable<Course>> Courses()
        {
            var courses = AudioService.GetCourses();

            return new ActionResult<IEnumerable<Course>>(courses);
        }

        [HttpGet("Course/{name}")]
        [ResponseCache(Duration = 300)]
        public ActionResult<Course> Course(string name)
        {
            var course = AudioService.GetCourse(name);

            return new ActionResult<Course>(course);
        }

        [HttpGet("Course/{courseName}/Lesson/{id}")]
        [ResponseCache(Duration = 300)]
        public ActionResult<string> Lesson(string courseName, string id)
        {
            var key = CacheKey + $"/course/{courseName}/lesson/" + id;

            if (MemoryCache.TryGetValue(key, out dynamic result))
                return result;

            var lesson = "";

            if (id.EndsWith("mp3"))
                lesson = "data:audio/mpeg;base64," + Convert.ToBase64String(AudioService.GetLesson(courseName, id));
            else if (id.EndsWith("webm"))
                lesson = "data:audio/webm;base64," + Convert.ToBase64String(AudioService.GetLesson(courseName, id));
            else
                throw new NotImplementedException("That file type is not covered.");

            MemoryCache.Set(key, lesson, TimeSpan.FromDays(1));

            return new ActionResult<string>(lesson);
        }
    }
}
