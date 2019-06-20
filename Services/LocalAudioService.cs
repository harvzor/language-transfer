using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace language_transfer.Services
{
    /// <summary>
    /// Use audio from the local file system.
    /// </summary>
    public class LocalAudioService : IAudioService
    {
        private readonly IHostingEnvironment HostingEnvironment;
        private readonly Configuration Configuration;

        public LocalAudioService(IHostingEnvironment env, IConfiguration configuration)
        {
            if (env == null)
                throw new ArgumentNullException(nameof(env));

            this.HostingEnvironment = env;

            if (configuration == null)
                throw new ArgumentNullException(nameof(configuration));

            this.Configuration = configuration.Get<Configuration>();
        }

        private Data _data;
        private Data Data
        {
            get
            {
                if (_data == null)
                {
                    _data = Configuration.Data;

                    _data.Courses.ToList().ForEach(course =>
                    {
                        var audioDir = HostingEnvironment.ContentRootPath +
                            (
                                HostingEnvironment.IsProduction()
                                    ? "/ClientApp/build/"
                                    : "/ClientApp/public/"
                            )
                            + course.Path;

                        var audioFilePaths = Directory.EnumerateFiles(audioDir);

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
            return File.ReadAllBytes(HostingEnvironment.ContentRootPath + "/ClientApp/public/audio/german/" + id);
        }
    }
}
