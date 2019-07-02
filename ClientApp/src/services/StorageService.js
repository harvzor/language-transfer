import dbService from './dbService'
import Lesson from '../models/LessonModel'
import Course from '../models/CourseModel'

/**
 * High level API for storing structured information in various places (Indexed DB or Local Storage).
 */
var storage = function() {
    let courses = function() {
        let get = async(name) => {
            let course = await dbService.courses.get(name)

            if (course === null)
                return null

            return new Course(course)
        }

        let set = (course) => {
            dbService.courses.set(course)
        }

        return {
            get,
            set
        }
    }()

    let lessons = function() {
        let getAll = async() => {
            return (await dbService.getAllLessons())
                .map(lesson => new Lesson(lesson))
        }

        let setAll = (lessonsForSaving) => {
            if (lessonsForSaving.audio === null) {
                // ??
            } else {
                lessonsForSaving
                    .forEach(lesson => {
                        dbService.setLesson(lesson)
                    })
            }
        }

        let get = async(lessonId, courseName) => {
            let lesson = await dbService.getLesson(lessonId, courseName)

            if (lesson === null)
                return null

            return new Lesson(lesson)
        }

        let set = (lesson) => {
            dbService.setLesson(lesson)
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
        courses: courses,
        lessons: lessons,
        settings: settings
    }
}()

export default storage
