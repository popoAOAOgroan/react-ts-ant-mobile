function Storage(name) {
    this.name = name;
}

Storage.prototype.build = function () {
    self.localStorage.setItem(this.name, JSON.stringify({}));
};
Storage.prototype.putItem = function (key, value) {
    var jsonStr = self.localStorage.getItem(this.name);
    var obj = JSON.parse(jsonStr);
    obj[key] = value;

    self.localStorage.setItem(this.name, JSON.stringify(obj));
};
Storage.prototype.getItem = function (key) {
    var jsonStr = self.localStorage.getItem(this.name);
    var obj = JSON.parse(jsonStr);
    return obj[key];
};
Storage.prototype.removeItem = function(key) {
    var jsonStr = self.localStorage.getItem(this.name);
    var obj = JSON.parse(jsonStr);
    delete obj[key];
    self.localStorage.setItem(this.name, JSON.stringify(obj));
};
Storage.prototype.remove = function(){
    self.localStorage.removeItem(this.name);
};
Storage.prototype.clear = function(){
    self.localStorage.clear();
};

function SessionStorage(name) {
    this.name = name;
}

SessionStorage.prototype.build = function () {
    self.sessionStorage.setItem(this.name, JSON.stringify({}));
};
SessionStorage.prototype.putItem = function (key, value) {
    var jsonStr = self.sessionStorage.getItem(this.name);
    var obj = JSON.parse(jsonStr);
    obj[key] = value;

    self.sessionStorage.setItem(this.name, JSON.stringify(obj));
};
SessionStorage.prototype.getItem = function (key) {
    var jsonStr = self.sessionStorage.getItem(this.name);
    var obj = JSON.parse(jsonStr);
    return obj[key];
};
SessionStorage.prototype.removeItem = function(key) {
    var jsonStr = self.sessionStorage.getItem(this.name);
    var obj = JSON.parse(jsonStr);
    delete obj[key];
    self.sessionStorage.setItem(this.name, JSON.stringify(obj));
};
SessionStorage.prototype.remove = function(){
    self.sessionStorage.removeItem(this.name);
};
SessionStorage.prototype.clear = function(){
    self.sessionStorage.clear();
};
let CreateStorage = {
    localStorage: function (name) {
        var myStorage = new Storage(name);
        if (!self.localStorage.getItem(name)) {
            myStorage.build();
        }
        return myStorage;
    },
    sessionStorage: function (name) {
        var myStorage = new SessionStorage(name);
        if (!self.sessionStorage.getItem(name)) {
            myStorage.build();
        }
        return myStorage;
    }
}
export default CreateStorage;