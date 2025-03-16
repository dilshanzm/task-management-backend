
exports.save = function (insertData, model) {
    return new Promise(function (resolve, reject) {
        model.create(insertData).then((result) => {
            return resolve(result);
        }, err => {
            return reject({
                error: err.message,
                code: err.code
            });
        })
    });
};
exports.findAll = function (att, whereOption, groupBy, inclu, limit, offset, orderBy, model) {
    return new Promise(function (resolve, reject) {
        model.findAll({
            limit: limit,
            offset: offset,
            attributes: att,
            where: whereOption,
            include: inclu,
            group: groupBy,
            order: orderBy
        }).then((result) => {
            return resolve(result)
        }, err => {
            return reject({
                error: err.original,
                code: err.code
            });
        })
    });
}
exports.findOne = function (att, whereOption, groupBy, inclu, limit, offset, orderBy, model) {
    return new Promise(function (resolve, reject) {
        model.findOne({
            limit: limit,
            offset: offset,
            attributes: att,
            where: whereOption,
            include: inclu,
            group: groupBy,
            order: orderBy
        }).then((result) => {
            if (!result) {
                var rus = null
                return resolve(rus);
            } else {
                return resolve(result);
            }
        }, err => {
            return reject({
                error: err.original,
                code: err.code
            });
        })
    });
}
exports.deleteTask = function (id, model) {
    return new Promise(function (resolve, reject) {
        model.destroy({
            where: {
                id: id
            }
        }).then(function (result) {
            return resolve(result)
        }).catch(function (error) {
            return reject({
                error: error.original,
                code: 420
            });
        });
    });
}
exports.genarateRandomCode = async function (length) {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};



