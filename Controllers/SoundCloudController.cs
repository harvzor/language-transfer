using language_transfer.Services;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("Playlists")]
        public async Task<ActionResult<dynamic>> Playlists()
        {
            return await SoundCloudService.GetPlaylists();
        }

        [HttpGet("Playlist/{id}")]
        public async Task<ActionResult<dynamic>> Playlist(int id)
        {
            return await SoundCloudService.GetPlaylist(id);
        }
    }
}
