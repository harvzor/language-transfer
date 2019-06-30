import Lesson from './LessonModel'
import storageService from '../services/StorageService'

/**
 * A course model.
 * @param {Obect} course
 * @return {Course}
 */
var Course = function(course) {
    if (typeof course === 'undefined')
        course = {}

    this.name = course.name || ''
    this.title = course.title || ''
    this.path = course.path || ''
    this.lessons = (course.lessons || [])
        .map(lesson => new Lesson(lesson))

    /**
     * Total seconds this user has listened to this course for.
    */
    this.totalListeningTime = 0

    /**
     * Get the percentage of complete lessons.
     * @returns {number}
     */
    this.calculateCompletionPercentage = () => {
        return Math.floor(
            this.lessons.filter(lesson => lesson.completed).length
            / this.lessons.length
            * 100
        ) || 0
    }

    /**
     * Save relevent course information to storage.
     * @returns {void}
     */
    this.save = async() => {
        storageService.courses.set({
            name: this.name,
            totalListeningTime: this.totalListeningTime,
        })
    }

    /**
     * Get the latest saved object from storage (or it will just return this object.)
     * @returns {Object} Course object.
     */
    this.getSaved = async() => {
        try
        {
            let storedCourse = storageService.courses.get(this.name)

            this.totalListeningTime = storedCourse.totalListeningTime
        }
        catch
        {
            return this
        }
    }

    let getSavedLessonsInternal = (lessons, index, callback, onEndCallback) => {
        if (lessons.length === index) {
            if (typeof onEndCallback !== 'undefined')
                onEndCallback(this)

            return
        }

        lessons[index].getSaved()
            .then(lesson => {
                this.lessons.push(lesson)

                callback(this)

                getSavedLessonsInternal(lessons, index + 1, callback, onEndCallback)
            })
    }

    this.getSavedLessons = (callback, onEndCallback) => {
        let lessons = this.lessons

        this.lessons = []

        getSavedLessonsInternal(lessons, 0, callback, onEndCallback)
    }
}

export default Course
