export const postUserValidation = (req, res, next) => {
    const { first_name, last_name, password, email } = req.body;

    if (!first_name  || !last_name || !password || !email) {
        return res.status(400).json({ message: 'Firstname, lastname , password, and email are required.' });
    }
    // If all required fields are present, move to the next middleware
    next();
};

export const updateUserValidation = (req, res, next) => {
    const { password, email } = req.body;

    if (!password || !email) {
        return res.status(400).json({ message: 'Firstname, lastname , password, and email are required.' });
    }

    // If all required fields are present, move to the next middleware
    next();
};

export const deleteUserValidation = (req, res, next) => {
    const { password, email,  } = req.body;

    if (!password || !email) {
        return res.status(400).json({ message: 'Password, and email are required.' });
    }
    // If all required fields are present, move to the next middleware
    next();
};

export const getUserValidation = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'User email is required.' });
    }

    // If all required fields are present, move to the next middleware
    next();
};