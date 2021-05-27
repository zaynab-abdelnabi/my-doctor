export const SaveUser = (req, res) => {
    req.checkBody('name')
        .notEmpty()
        .withMessage('name is required');

    req.checkBody('email')
        .notEmpty()
        .withMessage('email is required');

    req.checkBody('email')
        .isEmail()
        .withMessage('the form of email is incorrect');

    req.checkBody('password')
        .notEmpty()
        .withMessage('password is required');

    req.checkBody('userType')
        .notEmpty()
        .withMessage('user type is required');
}