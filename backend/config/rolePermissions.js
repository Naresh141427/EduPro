const PERMISSIONS = require('./permissions')

module.exports = {
    student: [
        PERMISSIONS.COURSE_ENROLL
    ],

    instructor: [
        PERMISSIONS.COURSE_CREATE,
        PERMISSIONS.COURSE_UPDATE
    ],

    admin: [
        PERMISSIONS.USER_VIEW,
        PERMISSIONS.USER_DEACTIVATE,
        PERMISSIONS.COURSE_CREATE,
        PERMISSIONS.COURSE_UPDATE,
        PERMISSIONS.COURSE_DELETE
    ]
}