import Dexie from 'dexie'

/**
 * Used for storing audio.
 */
var dbService = function() {
    const db = new Dexie('language-transfer')

    db
        .version(1)
        .stores({
            lessons: '&id,audio'
        })

    let get = (id) => {
        return new Promise((resolve, reject) => {
            db.lessons.get(id)
                .then(lesson => {
                    resolve(lesson)
                })
                .catch(e => {
                    if (e.name === 'DataError') {
                        resolve(null)
                    } else {
                        reject(e)
                    }
                })
        })
    }

    /*
    let get = (id) => {
        return new Promise((resolve, reject) => {
            db.transaction('r', db.lessons, async() => {
                resolve(await db.lessons.get(id))
            })
            .catch(e => {
                console.error(e)

                reject(e)
            })
        })
    }
    */

    let set = async(lesson) => {
        return await db.lessons
            .add({
                id: lesson.id,
                audio: lesson.audio
            })
    }

    let remove = async(id) => {
        return await db.lessons
            .delete(id)
    }

    /*
    let set = (lesson) => {
        return new Promise((resolve, reject) => {
            db.transaction('w', db.lessons, async() => {
                db.lessons
                    .add({
                        id: lesson.id,
                        audio: lesson.audio
                    })

                resolve()
            })
            .catch(e => {
                console.error(e)

                reject(e)
            })
        })
    }
    */

    return {
        get: get,
        set: set,
        remove: remove
    }
}()

export default dbService
