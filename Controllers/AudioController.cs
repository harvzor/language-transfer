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

        [HttpGet("Playlists")]
        [ResponseCache(Duration = 300)]
        public ActionResult<IEnumerable<Course>> Playlists()
        {
            var key = CacheKey + "/playlists";

            if (_cache.TryGetValue(key, out dynamic result))
            {
                return result;
            }

            var playlists = _audioService.GetPlaylists();

            _cache.Set(key, playlists, TimeSpan.FromDays(1));

            return new ActionResult<IEnumerable<Course>>(playlists);
        }

        [HttpGet("Playlist/{id}")]
        [ResponseCache(Duration = 300)]
        public ActionResult<Course> Playlist(string id)
        {
            var key = CacheKey + "/playlist/" + id;

            if (_cache.TryGetValue(key, out dynamic result))
            {
                return result;
            }

            var playlist = _audioService.GetPlaylist(id);

            _cache.Set(key, playlist, TimeSpan.FromDays(1));

            return new ActionResult<Course>(playlist);
        }

        [HttpGet("Lesson/{id}")]
        [ResponseCache(Duration = 300)]
        public ActionResult<string> Lesson(string id)
        {
            var key = CacheKey + "/lesson/" + id;

            if (_cache.TryGetValue(key, out dynamic result))
            {
                return result;
            }

            var lesson = _audioService.GetLesson(id);

            _cache.Set(key, lesson, TimeSpan.FromDays(1));

            return new ActionResult<string>(lesson);
        }
    }
}
