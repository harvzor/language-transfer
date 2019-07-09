using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace language_transfer.Services
{
    /// <summary>
    /// Use audio from the local file system.
    /// </summary>
    public class LocalAudioService : IAudioService
    {
        private readonly IMemoryCache MemoryCache;
        private readonly IHostingEnvironment HostingEnvironment;
        private readonly Configuration Configuration;

        private const string CacheKey = "LocalAudioService";

        public LocalAudioService(IMemoryCache memoryCache, IHostingEnvironment env, IConfiguration configuration)
        {
            this.MemoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
            this.HostingEnvironment = env ?? throw new ArgumentNullException(nameof(env));
            this.Configuration = configuration?.Get<Configuration>() ?? throw new ArgumentNullException(nameof(configuration));
        }

        private string ClientAppPublicPath => HostingEnvironment.IsProduction()
            ? "/ClientApp/build/"
            : "/ClientApp/public/";

        private Data GetData()
        {
            var key = CacheKey + "/data";

            if (MemoryCache.TryGetValue(key, out dynamic result))
                return result;

            var data = Configuration.Data;

            data.Courses = data.Courses
                .Select(course =>
                {
                    var audioDir = HostingEnvironment.ContentRootPath + ClientAppPublicPath + course.Path;

                    var audioFilePaths = Directory.EnumerateFiles(audioDir);

                    /*
                        course.Id = course.Title
                            .ToLower()
                            .Replace(" ", "-");
                    */

                    course.Lessons = audioFilePaths
                        .Select(audioFilePath =>
                        {
                            return new Lesson
                            {
                                LessonId = Int32.Parse(Path.GetFileNameWithoutExtension(audioFilePath)),
                                CourseName = course.Name,
                                Title = "Lesson " + Path.GetFileNameWithoutExtension(audioFilePath),
                                FileName = Path.GetFileName(audioFilePath),
                                FileSize = Convert.ToBase64String(File.ReadAllBytes(audioFilePath)).Length
                            };
                        })
                        .ToList();

                    return course;
                })
                .ToList();

            MemoryCache.Set(key, data, TimeSpan.FromDays(1));

            return data;
        }

        public IEnumerable<Course> GetCourses()
        {
            return GetData().Courses;
        }

        public Course GetCourse(string name)
        {
            return GetData().Courses.FirstOrDefault(course => course.Name == name);
        }

        public byte[] GetLesson(string courseName, string id)
        {
            return File.ReadAllBytes(HostingEnvironment.ContentRootPath + ClientAppPublicPath  + $"/audio/{courseName}/" + id);
        }
    }
}
