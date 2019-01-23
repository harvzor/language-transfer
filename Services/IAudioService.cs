using System.Collections.Generic;
using System.Threading.Tasks;

public interface IAudioService
{
    IEnumerable<Course> GetPlaylists();

    Course GetPlaylist(string id);

    string GetLesson(string id);
}
