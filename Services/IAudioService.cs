using System.Collections.Generic;

namespace language_transfer
{
    public interface IAudioService
    {
        IEnumerable<Course> GetCourses();

        Course GetCourse(string name);

        byte[] GetLesson(string id);
    }
}
