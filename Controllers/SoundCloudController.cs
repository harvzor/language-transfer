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
    public class SoundCloudController : ControllerBase
    {
        private SoundCloudService SoundCloudService = new SoundCloudService();

        private readonly IMemoryCache _cache;
        private const string CacheKey = "soundcloud";

        public SoundCloudController(IMemoryCache memoryCache)
        {
            _cache = memoryCache;
        }

        [HttpGet("Playlists")]
        [ResponseCache(Duration = 300)]
        public async Task<ActionResult<object>> Playlists()
        {
            var key = CacheKey + "/playlists";

            if (_cache.TryGetValue(key, out dynamic result))
            {
                return result;
            }

            var playlists = await SoundCloudService.GetPlaylists();

            _cache.Set(key, playlists, TimeSpan.FromDays(1));

            return playlists;
        }

        [HttpGet("Playlist/{id}")]
        [ResponseCache(Duration = 300)]
        public async Task<ActionResult<dynamic>> Playlist(int id)
        {
            var key = CacheKey + "/playlist/" + id;

            if (_cache.TryGetValue(key, out dynamic result))
            {
                return result;
            }

            var playlist = await SoundCloudService.GetPlaylist(id);

            _cache.Set(key, playlist, TimeSpan.FromDays(1));

            return playlist;
        }
    }
}
