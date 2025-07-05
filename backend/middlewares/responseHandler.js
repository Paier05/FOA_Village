// Standardized Response Function
export const RES_TRANSLATION = {
    "wood": "木头",
    "bricks": "砖块",
    "livestock": "牲畜",
    "wheat": "稻米",
    "ore": "矿石",
    "textiles": "纺织品"
};

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export default handleResponse;