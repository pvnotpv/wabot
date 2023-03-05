const groups = require('../dbModels/groups')
const addGroup = require('./addGroup')
const rClient = require("../redis")

class group {

    constructor() {
        return;
    }

    static async getGroup(groupId, name) {
        const group = await rClient.get(groupId)
        if(!group) {
            const sGroup = await groups.findOne({groupId})
            if(!sGroup) {
                await addGroup(groupId, name)
            } else {
                rClient.set(groupId, JSON.stringify(sGroup))
            }
        } else {
            return group
        }
      
        return true
        
    }

}

module.exports = group;
