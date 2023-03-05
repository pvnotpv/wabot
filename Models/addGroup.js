const groups = require('../dbModels/groups')
const rClient = require("../redis")

async function createGroup(groupId, name) {
    const group = new groups({
        name: name,
        groupId: groupId,
        nsfw: false,
        ban: false,
        everyone: true,
        dlstat: true,
        dlmsgs: []
    });
    await group.save()
    const sGroup = await groups.findOne({groupId})
    await rClient.set(groupId, JSON.stringify(sGroup))
    return;
}

module.exports = createGroup;