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
            lessons: '&id,title,fileName,completed,downloaded'
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

    let getAll = async() => {
        return db.lessons.toArray()
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
            .put(lesson)
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
        getAll: getAll,
        set: set,
        remove: remove
    }
}()

export default dbService
