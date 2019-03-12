import Dexie from 'dexie'

/**
 * Used for storing audio.
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

    let get = async(lessonId, courseName) => {
        return db.lessons.get({ lessonId: lessonId, courseName: courseName })
    }

    let getAll = async() => {
        return db.lessons.toArray()
    }

    let set = async(lesson) => {
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
        get: get,
        getAll: getAll,
        set: set
    }
}()

export default dbService
