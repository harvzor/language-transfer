import Dexie from 'dexie'

/**
 * Used for storing information in Indexed DB.
 */
var dbService = function() {
    const db = new Dexie('language-transfer')

    db
        .version(1)
        .stores({
            // Audio is deliberately not indexed.
            // https://dexie.org/docs/Version/Version.stores()#warning
            lessons: '[lessonId+courseName]'
        })

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
        getLesson: getLesson,
        getAllLessons: getAllLessons,
        setLesson: setLesson
    }
}()

export default dbService
