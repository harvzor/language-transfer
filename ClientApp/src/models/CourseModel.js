import Lesson from './LessonModel'

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
