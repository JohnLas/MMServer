var skills = require('./skills');

function create(id) {
     this.id        = id;
     this.name      = skills.skills[id].name;
     this.power     = skills.skills[id].power;
     this.type      = skills.skills[id].type;
     return this;
}

exports.create = create;
