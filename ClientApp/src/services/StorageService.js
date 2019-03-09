import dbService from './dbService'
import Lesson from '../models/LessonModel'

var storage = function() {
    let lessons = function() {
        //let key = 'tracks'

        let getAll = async() => {
            return (await dbService.getAll())
                .map(lesson => new Lesson(lesson))
        }

        let setAll = (lessonsForSaving) => {
            if (lessonsForSaving.audio === null) {
                // ??
            } else {
                lessonsForSaving
                    .forEach(lesson => {
                        dbService.set(lesson)
                    })
            }
        }

        let get = async(id) => {
            let lesson = await dbService.get(id)

            if (lesson === null)
                return null

            return new Lesson(lesson)
        }

        let set = (lesson) => {
            dbService.set(lesson)
        }

        return {
            get: get,
            getAll: getAll,
            set: set,
            setAll: setAll
        }
    }()

    let settings = function() {
        let key = 'settings'

        let get = () => {
            return JSON.parse(localStorage.getItem(key))
        }

        let set = (data) => {
            localStorage.setItem(key, JSON.stringify(data))
        }

        return {
            get: get,
            set: set
        }
    }()

    return {
        lessons: lessons,
        settings: settings
    }
}()

export default storage
