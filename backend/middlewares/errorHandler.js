// Centralized Error Handler
const errorHandling = (err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        status: 500,
        message: "There is an error!",
        error: err.message,
    });
};

export default errorHandling;