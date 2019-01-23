using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;

namespace language_transfer.Services
{
    public class LocalAudioService : IAudioService
    {
        private readonly IHostingEnvironment env;

        public LocalAudioService(IHostingEnvironment env)
        {
            if (env == null)
                throw new ArgumentNullException(nameof(env));

            this.env = env;
        }

        private Data _data;
        private Data Data
        {
            get
            {
                if (_data == null)
                {
                    var text = File.ReadAllText(env.ContentRootPath + "/data.json", Encoding.UTF8);

                    _data = JsonConvert.DeserializeObject<Data>(text);

                    _data.Courses.ToList().ForEach(course =>
                    {
                        var audioFilePaths = Directory.EnumerateFiles(env.ContentRootPath + "/ClientApp/public/" + course.Path);

                        course.Id = course.Title
                            .ToLower()
                            .Replace(" ", "-");

                        course.Lessons = audioFilePaths.Select(audioFilePath =>
                        {
                            return new Lesson
                            {
                                Id = Path.GetFileNameWithoutExtension(audioFilePath),
                                Title = "Lesson " + Path.GetFileNameWithoutExtension(audioFilePath),
                                FileName = Path.GetFileName(audioFilePath)
                            };
                        });
                    });
                }

                return _data;
            }
        }

        public IEnumerable<Course> GetPlaylists()
        {
            return Data.Courses;
        }

        public Course GetPlaylist(string id)
        {
            return Data.Courses.FirstOrDefault(course => course.Id == id);
        }

        public string GetLesson(string id)
        {
            return File.ReadAllText(env.ContentRootPath + "/ClientApp/public/audio/german/" + id);
        }
    }
}
