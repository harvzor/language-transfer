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

                        /*
                            course.Id = course.Title
                                .ToLower()
                                .Replace(" ", "-");
                        */

                        course.Lessons = audioFilePaths.Select(audioFilePath =>
                        {
                            return new Lesson
                            {
                                LessonId = Int32.Parse(Path.GetFileNameWithoutExtension(audioFilePath)),
                                CourseName = course.Name,
                                Title = "Lesson " + Path.GetFileNameWithoutExtension(audioFilePath),
                                FileName = Path.GetFileName(audioFilePath),
                                FileSize = Convert.ToBase64String(File.ReadAllBytes(audioFilePath)).Length
                            };
                        });
                    });
                }

                return _data;
            }
        }

        public IEnumerable<Course> GetCourses()
        {
            return Data.Courses;
        }

        public Course GetCourse(string name)
        {
            return Data.Courses.FirstOrDefault(course => course.Name == name);
        }

        public byte[] GetLesson(string id)
        {
            // TODO: fix path
            return File.ReadAllBytes(env.ContentRootPath + "/ClientApp/public/audio/german/" + id);
        }
    }
}
