var api = function() {
    const baseUrl = '/api/audio/'

    /**
     * @private
     */
    var get = (item, isJson) => {
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

    var getLesson = (id) => {
        return get('lesson/' + id, false)
    }

    var getLessonAudio = (audioPath) => {
        return new Promise((resolve, reject) => {
            fetch(audioPath)
                .then(resp => {
                    //return resp.blob()
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
        getLesson: getLesson,
        getLessonAudio: getLessonAudio
    }
}()

export default api
