import Dexie from 'dexie'

/**
 * Used for storing information in Indexed DB.
 */
var dbService = function() {
    const db = new Dexie('language-transfer')

    db
        .version(1)
        .stores({
            courses: 'name',
            // Audio is deliberately not indexed.
            // https://dexie.org/docs/Version/Version.stores()#warning
            lessons: '[lessonId+courseName]'
        })

    let courses = function() {
        let get = async(name) => {
            return db.courses.get({ name: name })
        }

        let set = async(course) => {
            return await db.courses
                .put(course)
        }

        return {
            get,
            set
        }
    }()

    let getLesson = async(lessonId, courseName) => {
        return db.lessons.get({ lessonId: lessonId, courseName: courseName })
    }

    let getAllLessons = async() => {
        return db.lessons.toArray()
    }

    let setLesson = async(lesson) => {
        return await db.lessons
            .put(lesson)
    }

    /* Commented out because this isn't being used anywhere... yet.
        let remove = async(lessonId, courseId) => {
            return await db.lessons
                .delete({ lessonId: lessonId, courseId: courseId })
        }
    */

    return {
        courses,
        getLesson: getLesson,
        getAllLessons: getAllLessons,
        setLesson: setLesson
    }
}()

export default dbService
