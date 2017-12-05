ServerMob = function(type, startX, startY) {
    var x = startX;
    var y = startY;

    var type = type;

    var id;

    var getX = function() {
        return x;
    }

    var getY = function() {
        return y;
    }

    var setX = function(newX) {
        x = newX;
    }

    var setY = function(newY) {
        y = newY;
    }
    
    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        type: type,
        id: id
    }
}

module.exports = ServerMob;