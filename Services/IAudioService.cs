using System.Collections.Generic;
using System.Threading.Tasks;

public interface IAudioService
{
    IEnumerable<Course> GetCourses();

    Course GetCourse(string name);

    byte[] GetLesson(string id);
}
