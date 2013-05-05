var request = require('./postRequest.js');

exports.create = function(idFacebook,socket,login,X,Y) {
    this.id = idFacebook;
    socket.id = idFacebook;
    this.idFacebook = idFacebook;
    this.socket = socket;
    this.X = X;
    this.Y = Y;
    this.login = login;
    this.savePosition = savePosition;
    socket.user = this;

    return this;
}
 
function savePosition() {
    data = new Object();
    data.X =  this.X;
    data.Y = this.Y;
    var url = '/MegaMonster/users/setPosition/'+this.id+'.json';
    var callback = function(response){};
    request.post(data,url,callback);
}