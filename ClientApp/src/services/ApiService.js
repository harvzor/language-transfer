var api = function() {
    const baseUrl = '/api/audio/'

    /**
     * @private
     */
    var get = async(item, isJson) => {
        return new Promise((resolve, reject) => {
            fetch(baseUrl + item)
                .then(resp => {
                    if (isJson)
                        return resp.json()

                    return resp.text()
                })
                .then(data => {
                    resolve(data)
                })
                .catch(() => {
                    reject()
                })
        });
    };

    var getCourses = () => {
        return get('courses', true)
    }

    var getCourse = (id) => {
        return get('course/' + id, true)
    }

    // var getLesson = (courseName, id) => {
    //     return get('course/' + courseName + '/lesson/' + id, false)
    // }

    var getLessonAudio = (courseName, id) => {
        return new Promise((resolve, reject) => {
            fetch(`${baseUrl}course/${courseName}/lesson/${id}`)
                .then(resp => {
                    return resp.text()
                })
                .then(data => {
                    resolve(data)
                })
                .catch(() => {
                    reject()
                })
        })
    }

    return {
        getCourses: getCourses,
        getCourse: getCourse,
        // getLesson: getLesson,
        getLessonAudio: getLessonAudio
    }
}()

export default api
