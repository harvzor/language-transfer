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
        private readonly IAudioService _audioService;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "audio";

        public AudioController(IMemoryCache memoryCache, IAudioService audioService)
        {
            _audioService = audioService;
            _cache = memoryCache;
        }

        [HttpGet("Courses")]
        [ResponseCache(Duration = 300)]
        public ActionResult<IEnumerable<Course>> Courses()
        {
            var key = CacheKey + "/courses";

            if (_cache.TryGetValue(key, out dynamic result))
            {
                return result;
            }

            var courses = _audioService.GetCourses();

            _cache.Set(key, courses, TimeSpan.FromDays(1));

            return new ActionResult<IEnumerable<Course>>(courses);
        }

        [HttpGet("Course/{name}")]
        [ResponseCache(Duration = 300)]
        public ActionResult<Course> Course(string name)
        {
            var key = CacheKey + "/course/" + name;

            if (_cache.TryGetValue(key, out dynamic result))
            {
                return result;
            }

            var course = _audioService.GetCourse(name);

            _cache.Set(key, course, TimeSpan.FromDays(1));

            return new ActionResult<Course>(course);
        }

        [HttpGet("Course/{courseName}/Lesson/{id}")]
        [ResponseCache(Duration = 300)]
        public ActionResult<string> Lesson(string courseName, string id)
        {
            var key = CacheKey + $"/course/{courseName}/lesson/" + id;

            if (_cache.TryGetValue(key, out dynamic result))
            {
                return result;
            }

            var lesson = "data:audio/webm;base64," + Convert.ToBase64String(_audioService.GetLesson(courseName, id));

            _cache.Set(key, lesson, TimeSpan.FromDays(1));

            return new ActionResult<string>(lesson);
        }
    }
}
