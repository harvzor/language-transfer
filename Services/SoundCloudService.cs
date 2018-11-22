using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace language_transfer.Services
{
    public class SoundCloudService
    {
        private const string ClientId = "l8WSPv4CxauOFLU9Rum53U1ZCP0k1D2C";
        private const string AppVersion = "1542807955";

        public async Task<dynamic> GetPlaylists()
        {
            var url = $"https://api-v2.soundcloud.com/users/81304541/playlists?client_id={ClientId}&limit=100&app_version={AppVersion}&app_locale=en";

            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage res = await client.GetAsync(url))
            using (HttpContent content = res.Content)
            {
                return content.ReadAsStringAsync().Result;
            }
        }

        public async Task<dynamic> GetPlaylist(int id)
        {
            var url = $"https://api.soundcloud.com/playlists/{id}?client_id={ClientId}";

            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage res = await client.GetAsync(url))
            using (HttpContent content = res.Content)
            {
                return content.ReadAsStringAsync().Result;
            }
        }
    }
}
